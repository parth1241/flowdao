import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import DAO from "@/lib/models/DAO";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { userId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { action, role } = await req.json(); // action: "updateRole" or "remove"
    await dbConnect();

    if (action === "remove") {
      await User.findByIdAndUpdate(params.userId, { daoId: null, role: "member" }); // reset
      await DAO.findByIdAndUpdate(session.user.daoId, { $pull: { members: { userId: params.userId } } });
      return NextResponse.json({ success: true });
    } else if (action === "updateRole") {
      const u = await User.findByIdAndUpdate(params.userId, { role }, { new: true });
      await DAO.updateOne(
        { _id: session.user.daoId, "members.userId": params.userId },
        { $set: { "members.$.role": role } }
      );
      return NextResponse.json({ user: u });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
