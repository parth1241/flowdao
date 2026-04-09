import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const members = await User.find({ daoId: session.user.daoId }).select("-passwordHash -lockedUntil -failedLoginAttempts");
    
    // Compute total voting power to give percentages
    const totalPower = members.reduce((sum, m) => sum + (m.tokenBalance || 0), 0);

    return NextResponse.json({ 
      members: members.map(m => ({
        ...m.toObject(),
        votingPowerPercent: totalPower > 0 ? ((m.tokenBalance || 0) / totalPower) * 100 : 0
      })) 
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
