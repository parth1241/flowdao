import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Proposal from "@/lib/models/Proposal";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { proposalId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const proposal = await Proposal.findOneAndUpdate(
      { _id: params.proposalId, status: { $in: ["draft", "active"] }, daoId: session.user.daoId },
      { $set: { status: "cancelled" } },
      { new: true }
    );
    if (!proposal) return NextResponse.json({ error: "Cannot cancel" }, { status: 400 });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
