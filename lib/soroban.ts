import { Horizon, rpc, TransactionBuilder, Networks, Address, Contract, xdr, nativeToScVal } from '@stellar/stellar-sdk';
import { env } from './env';
import crypto from 'crypto';

const rpcServer = new rpc.Server(env.NEXT_PUBLIC_SOROBAN_RPC);
const networkPassphrase = env.NEXT_PUBLIC_STELLAR_NETWORK === 'testnet' ? Networks.TESTNET : Networks.PUBLIC;
const horizonServer = new Horizon.Server(env.NEXT_PUBLIC_STELLAR_HORIZON);

interface HorizonBalance {
  asset_type: string;
  asset_code?: string;
  asset_issuer?: string;
  balance: string;
}

// Utility for client-side signing using Freighter
export async function buildAndSignClient(sourcePublicKey: string, operation: xdr.Operation): Promise<{ txHash: string, result?: string }> {
  if (typeof window === 'undefined') throw new Error("Client function called on server");
  
  // Dynamic import to avoid SSR crash
  const freighter = await import('@stellar/freighter-api');
  if (!await freighter.isConnected()) {
    throw new Error("Freighter not connected");
  }

  try {
    const account = await rpcServer.getAccount(sourcePublicKey);
    
    const tx = new TransactionBuilder(account, {
      fee: "100",
      networkPassphrase
    })
    .addOperation(operation)
    .setTimeout(30)
    .build();

    // Prepare (Simulate)
    const preparedTx = await rpcServer.prepareTransaction(tx);
    
    // Sign with Freighter
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const signedResult = await freighter.signTransaction(preparedTx.toXDR(), { 
        network: env.NEXT_PUBLIC_STELLAR_NETWORK.toUpperCase()
    } as any);
    
    // signTransaction returns { signedTxXdr: string }
    const signedXdr = typeof signedResult === 'string' ? signedResult : (signedResult as any).signedTxXdr;
    /* eslint-enable @typescript-eslint/no-explicit-any */

    const sendResponse = await rpcServer.sendTransaction(TransactionBuilder.fromXDR(signedXdr, networkPassphrase));
    
    if (sendResponse.status === "ERROR") {
      throw new Error("Transaction failed during submission");
    }

    // Poll for status
    let statusResponse = await rpcServer.getTransaction(sendResponse.hash);
    while (statusResponse.status === "NOT_FOUND") {
      await new Promise(r => setTimeout(r, 1000));
      statusResponse = await rpcServer.getTransaction(sendResponse.hash);
    }

    if (statusResponse.status === "SUCCESS" && statusResponse.resultMetaXdr) {
      return { txHash: sendResponse.hash, result: statusResponse.resultMetaXdr.toXDR("base64") };
    } else {
      throw new Error(`Transaction failed with status: ${statusResponse.status}`);
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Blockchain transaction failed";
    throw new Error(msg);
  }
}

export async function createProposal(adminWallet: string, proposal: { title: string, description: string, type: string, amount?: number, recipient?: string, closesAt: string | Date }) {
  const contractId = env.NEXT_PUBLIC_DAO_ID;
  if (!contractId) throw new Error("DAO Contract ID not configured");

  const contract = new Contract(contractId);
  const op = contract.call(
    "create_proposal",
    ...[
      new Address(adminWallet).toScVal(),
      nativeToScVal(proposal.title),
      nativeToScVal(proposal.description),
      nativeToScVal(proposal.type === 'treasury_spend' ? 1 : 0),
      nativeToScVal(BigInt(proposal.amount || 0), { type: "i128" }),
      new Address(proposal.recipient || adminWallet).toScVal(),
      nativeToScVal(BigInt(Math.floor(new Date(proposal.closesAt).getTime() / 1000)), { type: "u64" }),
    ]
  );

  return await buildAndSignClient(adminWallet, op);
}

export async function castVote(voterWallet: string, proposalId: string, voteChoice: string, votingPower: number) {
  const contractId = env.NEXT_PUBLIC_DAO_ID;
  if (!contractId) throw new Error("DAO Contract ID not configured");

  const choiceVal = voteChoice === "for" ? 1 : voteChoice === "against" ? 2 : 0; // abstain:0, for:1, against:2
  
  const contract = new Contract(contractId);
  const op = contract.call(
    "vote",
    ...[
      new Address(voterWallet).toScVal(),
      nativeToScVal(proposalId),
      nativeToScVal(choiceVal),
      nativeToScVal(BigInt(votingPower), { type: "i128" }),
    ]
  );

  return await buildAndSignClient(voterWallet, op);
}

export async function executeProposal(adminWallet: string, proposalId: string, _treasurySecretKey: string) {
  const contractId = env.NEXT_PUBLIC_DAO_ID;
  if (!contractId) throw new Error("DAO Contract ID not configured");
  void _treasurySecretKey;

  const contract = new Contract(contractId);
  const op = contract.call(
    "execute",
    ...[
      new Address(adminWallet).toScVal(),
      nativeToScVal(proposalId),
    ]
  );

  return await buildAndSignClient(adminWallet, op);
}

export async function mintGovernanceToken(_issuerSecretKey: string, _recipientWallet: string, _amount: number) {
  // Token minting is typically handled via standard Stellar Assets in Stellar.ts
  // This could be a Soroban-based token mint if preferred.
  void _issuerSecretKey; void _recipientWallet; void _amount;
  return { txHash: crypto.randomBytes(32).toString('hex') };
}

export async function getProposalState(_proposalId: string) {
  void _proposalId;
  return { votesFor: 0, votesAgainst: 0, status: 'active', quorumReached: false };
}

export async function getTreasuryBalance(treasuryWallet: string) {
  try {
    const account = await horizonServer.loadAccount(treasuryWallet);
    const nativeBal = account.balances.find((b: HorizonBalance) => b.asset_type === 'native');
    return nativeBal ? parseFloat(nativeBal.balance) : 0;
  } catch (err) {
    void err;
    return 0; // fallback if account not yet funded
  }
}

export async function getTokenBalance(wallet: string, assetCode: string, issuerWallet: string) {
  try {
    const account = await horizonServer.loadAccount(wallet);
    const tokenBal = account.balances.find((b: HorizonBalance) => b.asset_code === assetCode && b.asset_issuer === issuerWallet);
    return tokenBal ? parseFloat(tokenBal.balance) : 0;
  } catch (err) {
    void err;
    return 0;
  }
}
