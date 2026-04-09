import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Proposal from "@/lib/models/Proposal";
import DAO from "@/lib/models/DAO";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { executeProposal } from "@/lib/soroban";
import { decryptSecret } from "@/lib/stellar";

export async function POST(req: Request, { params }: { params: { proposalId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const proposal = await Proposal.findById(params.proposalId);
    if (!proposal || proposal.status !== "passed" || proposal.daoId !== session.user.daoId) {
      return NextResponse.json({ error: "Invalid proposal or not passed" }, { status: 400 });
    }

    const dao = await DAO.findById(proposal.daoId);
    const passedAtTime = proposal.updatedAt.getTime(); // When it switched to passed
    const timelockMs = (dao.timelockHours || 48) * 60 * 60 * 1000;
    
    if (Date.now() < passedAtTime + timelockMs) {
      return NextResponse.json({ error: `Timelock active. Please wait ${dao.timelockHours} hours after passing.` }, { status: 400 });
    }

    let txHash = "mock_tx_hash";
    if (proposal.type === "treasury_spend") {
      const secret = decryptSecret(dao.treasurySecretEncrypted);
      const res = await executeProposal(dao.adminWallet, params.proposalId, secret);
      txHash = res.txHash;
    }

    proposal.status = "executed";
    proposal.executedAt = new Date();
    proposal.txHash = txHash;
    await proposal.save();

    return NextResponse.json({ txHash });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
