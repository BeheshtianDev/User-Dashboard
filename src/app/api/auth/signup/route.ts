// === src/pages/api/auth/signup.ts ===
import { auth } from "@/lib/data";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing fields" });
  }
  const exists = auth.find((u) => u.username === username);
  if (exists) return res.status(400).json({ message: "User exists" });

  auth.push({ username, password });
  res.status(200).json({ message: "User created" });
}
