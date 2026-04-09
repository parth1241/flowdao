import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DAO from "@/lib/models/DAO";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, description, quorumPercent, timelockHours } = await req.json();
    await dbConnect();

    const dao = await DAO.findByIdAndUpdate(
      session.user.daoId,
      { name, description, quorumPercent, timelockHours, updatedAt: new Date() },
      { new: true }
    ).select('-treasurySecretEncrypted -governanceToken.issuerSecretEncrypted');

    return NextResponse.json({ dao });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
