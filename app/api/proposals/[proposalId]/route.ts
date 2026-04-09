import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Proposal from "@/lib/models/Proposal";
import DAO from "@/lib/models/DAO";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { proposalId: string } }) {
  try {
    await dbConnect();
    const proposal = await Proposal.findById(params.proposalId);
    if (!proposal) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const dao = await DAO.findById(proposal.daoId);
    return NextResponse.json({ proposal, daoName: dao?.name });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { proposalId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    await dbConnect();

    const proposal = await Proposal.findOneAndUpdate(
      { _id: params.proposalId, status: "draft", daoId: session.user.daoId },
      { $set: body },
      { new: true }
    );
    if (!proposal) return NextResponse.json({ error: "Cannot update" }, { status: 400 });

    return NextResponse.json({ proposal });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
