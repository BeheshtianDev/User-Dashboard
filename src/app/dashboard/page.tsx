    "use client";
    import React, { useEffect, useState } from "react";
    import { motion, AnimatePresence } from "framer-motion";
    import { useRouter } from "next/navigation";
    import Link from "next/link";
    import { TOKEN } from "@/lib/axios"; // Keep TOKEN for auth check
    import { useUsers } from "@/hooks/useUsers";
    import api from "@/lib/axios";

    interface User {
      id: number;
      name: string;
      email: string;
      role?: string;
      bio?: string;
      phone?: string;
      joinedAt?: string;
    }

    const DashboardPage = () => {
      const router = useRouter();
      const { users, isLoading, mutate } = useUsers();
      const [name, setName] = useState("");
      const [email, setEmail] = useState("");
      const [role, setRole] = useState("");
      const [bio, setBio] = useState("");
      const [phone, setPhone] = useState("");
      const [editingId, setEditingId] = useState<number | null>(null);

      useEffect(() => {
        const token = localStorage.getItem("token");
        if (token !== TOKEN) {
          router.push("/");
        }
      }, [router]);

      const resetForm = () => {
        setName("");
        setEmail("");
        setRole("");
        setBio("");
        setPhone("");
        setEditingId(null);
      };

      const addUser = async () => {
        if (!name || !email) return;
        const newUser: User = {
          id: Date.now(),
          name,
          email,
          role: role || "pending",
          bio: bio || "",
          phone: phone || "",
          joinedAt: new Date().toLocaleDateString(),
        };
        await api.post("/users", newUser);
        mutate([...users, newUser], false); // Optimistic update
        resetForm();
      };

      const updateUser = async () => {
        if (!name || !email || editingId === null) return;
        const updatedUser: User = {
          id: editingId,
          name,
          email,
          role: role || "pending",
          bio,
          phone,
          joinedAt: new Date().toLocaleDateString(),
        };
        await api.put(`/users/${editingId}`, updatedUser);
        mutate(
          users.map((u: User) => (u.id === editingId ? updatedUser : u)),
          false
        );
        resetForm();
      };

      const deleteUser = async (id: number) => {
        await api.delete(`/users/${id}`);
        mutate(
          users.filter((u: User) => u.id !== id),
          false
        );
      };

      const startEdit = (user: User) => {
        setEditingId(user.id);
        setName(user.name);
        setEmail(user.email);
        setRole(user.role || "");
        setBio(user.bio || "");
        setPhone(user.phone || "");
      };

      const logout = () => {
        localStorage.removeItem("token");
        router.push("/");
      };

      if (isLoading) return <p className="text-white">Loading users...</p>;

      return (
        <div className="min-h-screen flex flex-col items-center justify-start py-20 bg-black/95 text-white gap-10 w-full relative">
          <span className="w-full h-[100vw] bg-stone-900 rounded-full absolute bottom-10" />

          {/* Header */}
          <motion.div
            className="w-[90%] z-10 flex justify-between items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <button
              onClick={logout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            >
              Logout
            </button>
          </motion.div>

          {/* Form */}
          <motion.div
            className="w-[90%] space-y-4 space-x-2 z-10 "
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="w-full flex gap-5 de:flex-row mo:flex-col">
              <input
                className="de:w-1/4 mo:w-full py-3 bg-black rounded pl-5 text-white/70"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="de:w-1/4 mo:w-full py-3 bg-black rounded pl-5 text-white/70"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="de:w-1/4 mo:w-full py-3 bg-black rounded pl-5 text-white/70"
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
              <input
                className="de:w-1/4 mo:w-full py-3 bg-black rounded pl-5 text-white/70"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

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
                className="de:w-1/4 mo:w-full bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded transition"
              >
                Add User
              </button>
            )}
          </motion.div>

          {/* User List */}
          <ul className="w-[90%] space-y-4 z-10">
            <AnimatePresence>
              {users.map((user: User) => (
                <motion.li
                  key={user.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between bg-black border border-white/20 py-4 px-[4vw] rounded shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                >
                  <div className="flex flex-wrap gap-4">
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-sm text-white/60">{user.email}</p>
                    <p className="text-sm text-white/40 italic">
                      Role: {user.role}
                    </p>
                  </div>
                  <div className="space-x-2 flex flex-wrap justify-end">
                    <Link href={`/dashboard/user/${user.id}`}>
                      <button className="text-blue-400 underline hover:text-blue-300">
                        View Profile
                      </button>
                    </Link>
                    <button
                      onClick={() => startEdit(user)}
                      className="bg-yellow-500 text-black px-3 py-1 rounded hover:bg-yellow-400"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      );
    };

    export default DashboardPage;
