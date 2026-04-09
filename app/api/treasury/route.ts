import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DAO from "@/lib/models/DAO";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const dao = await DAO.findById(session.user.daoId);
    if (!dao) return NextResponse.json({ error: "DAO not found" }, { status: 404 });

    // Using dynamic imports for server actions
    const { getTreasuryBalance } = await import('@/lib/soroban');
    const { getTransactionHistory } = await import('@/lib/stellar');

    const balance = await getTreasuryBalance(dao.treasuryWallet);
    const transactions = await getTransactionHistory(dao.treasuryWallet);

    return NextResponse.json({ balance, transactions });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
