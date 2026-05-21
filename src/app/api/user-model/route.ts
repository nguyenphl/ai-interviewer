import { NextResponse } from "next/server";
import { getOrCreateUserModel, deserializeUserModel } from "@/lib/user-model";

export async function GET() {
  try {
    const raw = await getOrCreateUserModel();
    return NextResponse.json(deserializeUserModel(raw));
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
