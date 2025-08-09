"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // <-- error state
  const router = useRouter();

  const signup = () => {
    if (!username.trim() || !password.trim()) {
      setError("Username and password cannot be empty");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "[]");
    type User = { username: string; password: string };
    const userExists = users.find((u: User) => u.username === username);

    if (userExists) {
      setError("User already exists");
      return;
    }

    const newUser = { username, password };
    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("token", "fake-jwt-token");

    setError(""); // Clear error on success
    alert("Signup successful");
    router.push("/");
  };

  return (
    <div
      className="h-screen overflow-hidden w-full flex flex-col gap-10
     items-center justify-center bg-black/95 text-white relative"
    >
      <span className="w-full h-[100vw] -left-1/4 -top-3/4 bg-stone-900 rounded-full absolute"></span>

      <h1 className="text-3xl mb-4 z-10">Sign Up</h1>

      <input
        className="max-w-[350px] z-10 w-[95%] py-3 bg-black rounded hover:px-5 focus:px-5 pl-36 text-white/70 transition-all focus:shadow-white/30 focus-within:shadow-lg focus:shadow-[0_0_20px_rgba(0,0,0,0.5)] duration-500 focus:outline-1 outline-white/30 shadow-black"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />

      <input
        className="max-w-[350px] z-10 w-[95%] py-3 bg-black rounded hover:px-5 focus:px-5 pl-36 text-white/70 transition-all focus:shadow-white/30 focus-within:shadow-lg focus:shadow-[0_0_20px_rgba(0,0,0,0.5)] duration-500 focus:outline-1 outline-white/30 shadow-black"
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Error message */}
      {error && (
        <p className="text-red-500 max-w-[350px] w-[95%] z-10 text-center">
          {error}
        </p>
      )}

      <button
        className="btn border border-black/80 hover:!shadow-white/30 hover:!shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-white/30 z-10"
        onClick={signup}
      >
        <span className="btn-text-one">Sign Up</span>
        <span className="btn-text-two">Create Account!</span>
      </button>
    </div>
  );
}
