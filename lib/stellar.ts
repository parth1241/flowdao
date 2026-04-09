import { Horizon, Keypair, TransactionBuilder, Asset, Networks, Operation } from "@stellar/stellar-sdk";
import crypto from "crypto";
import { env } from "./env";

const ENCRYPTION_KEY = Buffer.from(env.DAO_ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32), "utf-8"); // Must be 32 chars
const IV_LENGTH = 16;
const horizonServer = new Horizon.Server(env.NEXT_PUBLIC_STELLAR_HORIZON);

export function encryptSecret(secret: string): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(secret, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

export function decryptSecret(encrypted: string): string {
  if (!encrypted) return "";
  const parts = encrypted.split(":");
  if (parts.length !== 2) return "";
  const iv = Buffer.from(parts[0], "hex");
  const encryptedText = parts[1];
  const decipher = crypto.createDecipheriv("aes-256-cbc", ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

export async function fundWithFriendbot(address: string) {
  try {
    const res = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(address)}`);
    return await res.json();
  } catch (e) {
    console.error("Friendbot funding failed:", e);
    return null;
  }
}

export async function issueGovernanceToken(issuerSecretKey: string, recipientWallet: string, assetCode: string, amount: number) {
  try {
    const networkPassphrase = env.NEXT_PUBLIC_STELLAR_NETWORK === 'testnet' ? Networks.TESTNET : Networks.PUBLIC;
    const issuerKeypair = Keypair.fromSecret(issuerSecretKey);
    const issuerAccount = await horizonServer.loadAccount(issuerKeypair.publicKey());
    
    const asset = new Asset(assetCode, issuerKeypair.publicKey());
    
    const transaction = new TransactionBuilder(issuerAccount, {
      fee: "100",
      networkPassphrase
    })
    .addOperation(Operation.payment({
       destination: recipientWallet,
       asset: asset,
       amount: amount.toString(),
    }))
    .setTimeout(30)
    .build();

    transaction.sign(issuerKeypair);
    const result = await horizonServer.submitTransaction(transaction);
    return { txHash: result.hash };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Token issuance failed";
    console.error("Issue Token Error:", msg);
    throw new Error(msg);
  }
}

export async function getTransactionHistory(wallet: string) {
  try {
    const payments = await horizonServer.payments().forAccount(wallet).limit(20).call();
    return payments.records;
  } catch (err) {
    void err;
    return [];
  }
}
