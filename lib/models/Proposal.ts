import mongoose from "mongoose";

const ProposalSchema = new mongoose.Schema({
  daoId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  proposerId: { type: String, required: true },
  type: { type: String, enum: ["treasury_spend", "rate_change", "member_add", "member_remove", "text"], required: true },
  amount: { type: Number },
  recipient: { type: String },
  status: { type: String, enum: ["draft", "active", "passed", "failed", "executed", "cancelled", "timelocked"], default: "draft" },
  votesFor: { type: Number, default: 0 },
  votesAgainst: { type: Number, default: 0 },
  totalVotingPower: { type: Number },
  quorumReached: { type: Boolean, default: false },
  opensAt: { type: Date },
  closesAt: { type: Date },
  executedAt: { type: Date },
  txHash: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Proposal || mongoose.model("Proposal", ProposalSchema);
