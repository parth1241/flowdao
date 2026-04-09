import mongoose from "mongoose";

const TokenHoldingSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  daoId: { type: String, required: true },
  wallet: { type: String, required: true },
  balance: { type: Number, default: 0 },
  txHashMint: { type: String },
  mintedAt: { type: Date },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.models.TokenHolding || mongoose.model("TokenHolding", TokenHoldingSchema);
