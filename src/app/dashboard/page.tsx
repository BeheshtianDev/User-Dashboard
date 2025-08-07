"use client";
import React from "react";
// pages/dashboard.tsx

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TOKEN, users } from "@/lib/data";

interface User {
  id: number;
  name: string;
  email: string;
}

const Page = () => {
  const router = useRouter();
  const [userList, setUserList] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const logout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token !== TOKEN) {
      router.push("/");
    } else {
      setUserList([...users]);
    }
  }, [router]);

  const addUser = () => {
    if (!name || !email) return;
    const newUser = { id: Date.now(), name, email };
    setUserList((prev) => [...prev, newUser]);
    users.push(newUser);
    setName("");
    setEmail("");
  };

  const deleteUser = (id: number) => {
    const filtered = userList.filter((user) => user.id !== id);
    setUserList(filtered);
    const index = users.findIndex((u) => u.id === id);
    if (index !== -1) users.splice(index, 1);
  };

  const startEdit = (user: User) => {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
  };

  const updateUser = () => {
    if (!name || !email || editingId === null) return;
    const updated = userList.map((user) =>
      user.id === editingId ? { ...user, name, email } : user
    );
    setUserList(updated);
    const index = users.findIndex((u) => u.id === editingId);
    if (index !== -1) users[index] = { ...users[index], name, email };
    setName("");
    setEmail("");
    setEditingId(null);
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 bg-black/95 text-white gap-10 w-full">
      <div className="w-[90%]  flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
        >
          Logout
        </button>
      </div>

      <div className="w-[90%] space-y-4">
        <input
          className="de:w-1/4 mo:w-full py-3 bg-black block  rounded hover:px-5 focus:px-5 pl-48 text-white/70 transition-all focus:shadow-white/20 focus:shadow-[0_0_20px_rgba(0,0,0,0.5)] duration-500 focus:outline-1 outline-white/30 shadow-black"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className="de:w-1/4 mo:w-full py-3 bg-black block rounded hover:px-5 focus:px-5 pl-48 text-white/70 transition-all focus:shadow-white/20 focus:shadow-[0_0_20px_rgba(0,0,0,0.5)] duration-500 focus:outline-1 outline-white/30 shadow-black"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {editingId ? (
          <button
            onClick={updateUser}
            className="de:w-1/4 mo:w-full bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-400 transition-all duration-500"
          >
            Update User
          </button>
        ) : (
          <button
            onClick={addUser}
            className="btn de:!w-1/4 mo:!w-full !text-white/90 bg-blue-500 px-4 py-2 rounded hover:bg-blue-400 transition-all duration-500"
          >
            <span className="btn-text-one">Add User</span>
            <span className="btn-text-two">Submit</span>
          </button>
        )}
      </div>

      <ul className="w-[90%] space-y-4">
        {userList.map((user) => (
          <li
            key={user.id}
            className="flex items-center justify-between bg-black border border-white/20 py-4 px-20  rounded shadow-[0_0_15px_rgba(255,255,255,0.05)]"
          >
            <div>
              <p className="font-semibold text-white">{user.name}</p>
              <p className="text-sm text-white/60">{user.email}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => startEdit(user)}
                className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-400 transition"
              >
                Edit
              </button>
              <button
                onClick={() => deleteUser(user.id)}
                className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
