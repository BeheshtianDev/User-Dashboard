// === src/pages/api/users.ts ===
import { users } from "@/lib/data";
import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return res.status(200).json(users);
  }

  if (req.method === "POST") {
    const { name, email } = req.body;
    const id = Date.now();
    users.push({ id, name, email });
    return res.status(201).json({ message: "User added" });
  }

  if (req.method === "PUT") {
    const { id, name, email } = req.body;
    const user = users.find((u) => u.id === id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.name = name;
    user.email = email;
    return res.status(200).json({ message: "User updated" });
  }

  if (req.method === "DELETE") {
    const { id } = req.body;
    const index = users.findIndex((u) => u.id === id);
    if (index === -1)
      return res.status(404).json({ message: "User not found" });
    users.splice(index, 1);
    return res.status(200).json({ message: "User deleted" });
  }

  return res.status(405).end();
}
