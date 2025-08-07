"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
const page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const signup = () => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    const userExists = users.find((u: any) => u.username === username);
    if (userExists) {
      alert("User already exists");
      return;
    }

    const newUser = { username, password };
    const updatedUsers = [...users, newUser];
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    localStorage.setItem("token", "fake-jwt-token");

    alert("Signup successful");
    router.push("/");
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black/95 gap-10 text-white">
      <h1 className="text-3xl mb-4">Sign Up</h1>
      <input
        className=" max-w-[350px]  w-[95%] py-3 bg-black rounded  hover:px-5  focus:px-5 pl-36 text-white/70  transition-all focus:shadow-white/20  focus-within:shadow-lg focus:shadow-[0_0_20px_rgba(0,0,0,0.5)] duration-500 focus:outline-1 outline-white/30  shadow-black"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className=" max-w-[350px]  w-[95%] py-3 bg-black rounded  hover:px-5  focus:px-5 pl-36 text-white/70  transition-all focus:shadow-white/20  focus-within:shadow-lg focus:shadow-[0_0_20px_rgba(0,0,0,0.5)] duration-500 focus:outline-1 outline-white/30  shadow-black"
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn" onClick={signup}>
        <span className="btn-text-one">Sign Up</span>
        <span className="btn-text-two">Login !</span>
      </button>
    </div>
  );
};

export default page;
