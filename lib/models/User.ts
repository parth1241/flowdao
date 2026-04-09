import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true, sparse: true },
  passwordHash: { type: String },
  role: { type: String, enum: ["member", "admin"], required: true },
  linkedWallet: { type: String, sparse: true },
  avatarColor: { type: String, default: "#0ea5e9" },
  createdAt: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  rememberMe: { type: Boolean, default: false },
  failedLoginAttempts: { type: Number, default: 0 },
  lockedUntil: { type: Date },
  daoId: { type: String },
  tokenBalance: { type: Number, default: 0 },
  votingPower: { type: Number, default: 0 },
  preferences: {
    emailOnProposal: { type: Boolean, default: true },
    emailOnVoteClose: { type: Boolean, default: true },
    securityAlerts: { type: Boolean, default: true }
  }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
