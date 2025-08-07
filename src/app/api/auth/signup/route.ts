import { auth } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { username, password } = body;

  if (!username || !password) {
    return NextResponse.json({ message: "Missing fields" }, { status: 400 });
  }

  const exists = auth.find((u) => u.username === username);
  if (exists) {
    return NextResponse.json({ message: "User exists" }, { status: 400 });
  }

  auth.push({ username, password });
  return NextResponse.json({ message: "User created" }, { status: 200 });
}
