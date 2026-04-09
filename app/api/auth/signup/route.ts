import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import DAO from "@/lib/models/DAO";
import bcrypt from "bcryptjs";
import { encryptSecret, fundWithFriendbot } from "@/lib/stellar";
import { Keypair } from "@stellar/stellar-sdk";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password, role, daoName, daoId } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (role !== "member" && role !== "admin") {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    let finalDaoId = daoId;

    if (role === "admin") {
      if (!daoName) {
        return NextResponse.json({ error: "DAO Name required for admin" }, { status: 400 });
      }
      
      const slug = daoName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const existingDao = await DAO.findOne({ slug });
      if (existingDao) {
        return NextResponse.json({ error: "DAO with this name already exists" }, { status: 400 });
      }

      // Generate treasury keypair
      const treasuryKeypair = Keypair.random();
      const encryptedTreasurySecret = encryptSecret(treasuryKeypair.secret());

      // Generate issuer keypair for DAO
      const issuerKeypair = Keypair.random();
      const encryptedIssuerSecret = encryptSecret(issuerKeypair.secret());

      // Try funding with friendbot
      await fundWithFriendbot(treasuryKeypair.publicKey());
      await fundWithFriendbot(issuerKeypair.publicKey());

      const newDao = new DAO({
        name: daoName,
        slug,
        adminId: "temp", // will update after user is created
        treasuryWallet: treasuryKeypair.publicKey(),
        treasurySecretEncrypted: encryptedTreasurySecret,
        governanceToken: {
          assetCode: "FLOW",
          issuerWallet: issuerKeypair.publicKey(),
          issuerSecretEncrypted: encryptedIssuerSecret,
          totalSupply: 1000000,
          distributed: 0
        },
        members: []
      });
      await newDao.save();
      finalDaoId = newDao._id.toString();
    } else {
      if (!daoId) {
        return NextResponse.json({ error: "DAO ID required to join as member" }, { status: 400 });
      }
      const dao = await DAO.findById(daoId);
      if (!dao) {
        return NextResponse.json({ error: "DAO not found" }, { status: 404 });
      }
    }

    const user = new User({
      name,
      email,
      passwordHash,
      role,
      daoId: finalDaoId,
      tokenBalance: 0,
      votingPower: 0
    });
    await user.save();

    if (role === "admin") {
      await DAO.findByIdAndUpdate(finalDaoId, { 
        adminId: user._id.toString(),
        $push: {
          members: {
            userId: user._id.toString(),
            joinedAt: new Date(),
            role: "admin",
            tokenBalance: 0
          }
        }
      });
    } else {
      await DAO.findByIdAndUpdate(finalDaoId, {
        $push: {
          members: {
            userId: user._id.toString(),
            joinedAt: new Date(),
            role: "member",
            tokenBalance: 0
          }
        }
      });
    }

    return NextResponse.json({ success: true, userId: user._id.toString() });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
