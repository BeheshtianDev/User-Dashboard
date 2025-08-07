import { users } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const { name, email } = await req.json();
  const id = Date.now();
  users.push({ id, name, email });
  return NextResponse.json({ message: "User added" }, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const { id, name, email } = await req.json();
  const user = users.find((u) => u.id === id);
  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  user.name = name;
  user.email = email;
  return NextResponse.json({ message: "User updated" });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }
  users.splice(index, 1);
  return NextResponse.json({ message: "User deleted" });
}
