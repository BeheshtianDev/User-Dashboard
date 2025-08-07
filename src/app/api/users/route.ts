import { users, User } from "@/lib/data";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(users);
}

export async function POST(req: NextRequest) {
  const { name, email, role, bio, phone } = await req.json();

  if (!name || !email || !role) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  const newUser: User = {
    id: Date.now(),
    name,
    email,
    role,
    joinedAt: new Date().toISOString(),
    bio: bio || "",
    phone: phone || "",
  };

  users.push(newUser);

  return NextResponse.json(
    { message: "User added", user: newUser },
    { status: 201 }
  );
}

export async function PUT(req: NextRequest) {
  const { id, name, email, role, bio, phone } = await req.json();

  const user = users.find((u) => u.id === id);

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (bio !== undefined) user.bio = bio;
  if (phone !== undefined) user.phone = phone;

  return NextResponse.json({ message: "User updated", user });
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
