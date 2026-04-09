import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Proposal from "@/lib/models/Proposal";
import User from "@/lib/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await dbConnect();
    const { role, daoId } = session.user;
    if (!daoId) return NextResponse.json({ error: "No DAO associated with user" }, { status: 400 });

    const query: { daoId: string; status?: { $in: string[] } } = { daoId };
    if (role === "admin") {
      // Admin sees all
    } else {
      // Members see active, passed, executed, failed, timelocked
      query.status = { $in: ["active", "passed", "executed", "failed", "timelocked"] };
    }

    const proposals = await Proposal.find(query).sort({ createdAt: -1 });
    return NextResponse.json({ proposals });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, type, amount, recipient, opensAt, closesAt, txHash } = body;

    await dbConnect();

    // Snapshot total voting power
    const members = await User.find({ daoId: session.user.daoId });
    const totalVotingPower = members.reduce((sum, member) => sum + (member.tokenBalance || 0), 0);

    const proposal = new Proposal({
      daoId: session.user.daoId,
      title,
      description,
      proposerId: session.user.id,
      type,
      amount,
      recipient,
      totalVotingPower,
      opensAt,
      closesAt,
      txHash,
      status: "draft"
    });

    await proposal.save();
    return NextResponse.json({ proposal });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
