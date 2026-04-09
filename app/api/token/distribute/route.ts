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

    const { distributions } = await req.json(); // [{ userId, amount }]
    await dbConnect();
    const dao = await DAO.findById(session.user.daoId);
    const issuerSecret = decryptSecret(dao.governanceToken.issuerSecretEncrypted);

    const results = [];
    for (const dist of distributions) {
      const user = await User.findById(dist.userId);
      if (user && user.linkedWallet && user.daoId === session.user.daoId) {
        try {
          const res = await issueGovernanceToken(issuerSecret, user.linkedWallet, dao.governanceToken.assetCode, dist.amount);
          
          user.tokenBalance += dist.amount;
          user.votingPower += dist.amount;
          await user.save();

          dao.governanceToken.distributed += dist.amount;
          
          const holding = new TokenHolding({
            userId: user._id,
            daoId: dao._id,
            wallet: user.linkedWallet,
            balance: dist.amount,
            txHashMint: res.txHash,
            mintedAt: new Date()
          });
          await holding.save();

          results.push({ userId: dist.userId, success: true, txHash: res.txHash });
        } catch(err: unknown) {
          const msg = err instanceof Error ? err.message : "Unknown error";
          results.push({ userId: dist.userId, success: false, error: msg });
        }
      } else {
        results.push({ userId: dist.userId, success: false, error: "Invalid user or no wallet" });
      }
      // Sequential delay
      await new Promise(r => setTimeout(r, 500));
    }

    await dao.save();
    return NextResponse.json({ results });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
