import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import DAO from "@/lib/models/DAO";
import TokenHolding from "@/lib/models/TokenHolding";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { issueGovernanceToken, decryptSecret } from "@/lib/stellar";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { recipientUserId, amount } = await req.json();
    await dbConnect();

    const dao = await DAO.findById(session.user.daoId);
    const user = await User.findById(recipientUserId);
    
    if (!user || user.daoId !== session.user.daoId) return NextResponse.json({ error: "Invalid user" }, { status: 400 });
    if (!user.linkedWallet) return NextResponse.json({ error: "User has no linked wallet" }, { status: 400 });

    const issuerSecret = decryptSecret(dao.governanceToken.issuerSecretEncrypted);
    const res = await issueGovernanceToken(issuerSecret, user.linkedWallet, dao.governanceToken.assetCode, amount);
    
    user.tokenBalance += amount;
    user.votingPower += amount;
    await user.save();

    dao.governanceToken.distributed += amount;
    await dao.save();

    const holding = new TokenHolding({
      userId: user._id,
      daoId: dao._id,
      wallet: user.linkedWallet,
      balance: amount,
      txHashMint: res.txHash,
      mintedAt: new Date()
    });
    await holding.save();

    return NextResponse.json({ txHash: res.txHash });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
