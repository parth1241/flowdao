import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import DAO from "@/lib/models/DAO";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { walletAddress } = await req.json();
    await dbConnect();
    
    // Check if wallet is already linked to someone else
    const existing = await User.findOne({ linkedWallet: walletAddress });
    if (existing && existing._id.toString() !== session.user.id) {
      return NextResponse.json({ error: "Wallet already linked" }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(session.user.id, { linkedWallet: walletAddress }, { new: true });
    
    if (session.user.daoId) {
      await DAO.updateOne(
        { _id: session.user.daoId, "members.userId": session.user.id },
        { $set: { "members.$.wallet": walletAddress } }
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
