import { NextResponse } from "next/dist/server/web/spec-extension/response";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const { linkedWallet } = await req.json();
    if (!linkedWallet) return NextResponse.json({ error: "No wallet provided" }, { status: 400 });

    await dbConnect();
    const user = await User.findOne({ linkedWallet });
    if (!user) return NextResponse.json({ error: "Wallet not linked to any user" }, { status: 404 });

    // Assuming client handles session/jwt mapping
    return NextResponse.json({ success: true, user });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
