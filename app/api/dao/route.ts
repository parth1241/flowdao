import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import DAO from "@/lib/models/DAO";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const daoId = searchParams.get("daoId");
  
  try {
    await dbConnect();
    const query = daoId ? { _id: daoId } : { globals: { $exists: true } }; // fallback or actual condition
    const dao = await DAO.findOne(query).select('-treasurySecretEncrypted -governanceToken.issuerSecretEncrypted');
    
    if (!dao) return NextResponse.json({ error: "DAO not found" }, { status: 404 });
    return NextResponse.json({ dao });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
