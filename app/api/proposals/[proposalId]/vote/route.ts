import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Proposal from "@/lib/models/Proposal";
import Vote from "@/lib/models/Vote";
import User from "@/lib/models/User";
import DAO from "@/lib/models/DAO";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request, { params }: { params: { proposalId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { vote, txHash, voterWallet } = body;

    if (!["for", "against", "abstain"].includes(vote)) return NextResponse.json({ error: "Invalid vote option" }, { status: 400 });

    await dbConnect();
    const proposal = await Proposal.findById(params.proposalId);
    if (!proposal || proposal.status !== "active") return NextResponse.json({ error: "Proposal not active" }, { status: 400 });

    if (new Date() > new Date(proposal.closesAt)) {
      return NextResponse.json({ error: "Voting is closed" }, { status: 400 });
    }

    const existingVote = await Vote.findOne({ proposalId: params.proposalId, voterId: session.user.id });
    if (existingVote) return NextResponse.json({ error: "Already voted" }, { status: 400 });

    const user = await User.findById(session.user.id);
    const votingPower = user.tokenBalance || 0;
    
    if (votingPower === 0) return NextResponse.json({ error: "No governance tokens" }, { status: 403 });

    const newVote = new Vote({
      proposalId: params.proposalId,
      voterId: session.user.id,
      voterWallet,
      vote,
      votingPower,
      txHash
    });
    await newVote.save();

    if (vote === "for") proposal.votesFor += votingPower;
    else if (vote === "against") proposal.votesAgainst += votingPower;

    // Check quorum and passage
    const totalVotes = proposal.votesFor + proposal.votesAgainst;
    const dao = await DAO.findById(proposal.daoId);
    const quorumPercent = dao.quorumPercent || 51;
    
    const currentQuorum = (totalVotes / proposal.totalVotingPower) * 100;
    if (currentQuorum >= quorumPercent) {
      proposal.quorumReached = true;
      const majority = proposal.votesFor / totalVotes;
      if (majority > 0.5) {
        proposal.status = "passed";
        // Timelock mechanism triggers implicitly upon 'passed' status, we wait `timelockHours` before execution
      }
    }

    await proposal.save();

    return NextResponse.json({ vote: newVote, proposal });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
