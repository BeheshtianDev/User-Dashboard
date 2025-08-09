import { auth, TOKEN } from "@/lib/axios";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  if (request.method !== "POST") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 }
    );
  }

  const body = await request.json();
  const { username, password } = body;
  const user = auth.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }

  return NextResponse.json({ token: TOKEN }, { status: 200 });
}
