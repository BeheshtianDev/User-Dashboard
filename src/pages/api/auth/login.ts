// === src/pages/api/auth/login.ts ===
import { auth, TOKEN } from "@/lib/data";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const { username, password } = req.body;
  const user = auth.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  res.status(200).json({ token: TOKEN });
}
