import mongoose from "mongoose";

const VoteSchema = new mongoose.Schema({
  proposalId: { type: String, required: true },
  voterId: { type: String, required: true },
  voterWallet: { type: String, required: true },
  vote: { type: String, enum: ["for", "against", "abstain"], required: true },
  votingPower: { type: Number, required: true },
  txHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Vote || mongoose.model("Vote", VoteSchema);
