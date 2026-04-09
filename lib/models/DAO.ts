import mongoose from "mongoose";

const DAOSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  description: { type: String },
  adminId: { type: String, required: true },
  treasuryWallet: { type: String },
  treasurySecretEncrypted: { type: String },
  governanceToken: {
    assetCode: { type: String },
    issuerWallet: { type: String },
    issuerSecretEncrypted: { type: String },
    totalSupply: { type: Number, default: 0 },
    distributed: { type: Number, default: 0 }
  },
  members: [{
    userId: String,
    wallet: String,
    tokenBalance: Number,
    joinedAt: Date,
    role: String
  }],
  quorumPercent: { type: Number, default: 51 },
  timelockHours: { type: Number, default: 48 },
  isActive: { type: Boolean, default: true },
  contractId: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.models.DAO || mongoose.model("DAO", DAOSchema);
