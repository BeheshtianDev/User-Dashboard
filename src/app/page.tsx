"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
const Page = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  type User = {
    username: string;
    password: string;
  };

  const login = () => {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      localStorage.setItem("token", "fake-jwt-token");
      router.push("/dashboard");
    } else {
      alert("Invalid username or password");
    }
  };

  return (
    <div
      className="h-screen overflow-hidden w-full flex flex-col gap-10
   items-center justify-center bg-black/95 text-white relative"
    >
      <span className="w-full h-[100vw]  -left-1/4 -top-3/4  bg-stone-900   rounded-full absolute"></span>
      <h1 className="text-3xl mb-4 z-10">Login</h1>
      <input
        className=" max-w-[350px] z-10 w-[95%] py-3 bg-black rounded  hover:px-5  focus:px-5 pl-36 text-white/70  transition-all focus:shadow-white/30  focus-within:shadow-lg focus:shadow-[0_0_20px_rgba(0,0,0,0.5)] duration-500 focus:outline-1 outline-white/30  shadow-black"
        placeholder="username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className=" max-w-[350px] z-10 w-[95%] py-3 bg-black rounded  hover:px-5  focus:px-5 pl-36 text-white/70 transition-all focus:shadow-white/30 focus-within:shadow-lg focus:shadow-[0_0_20px_rgba(0,0,0,0.5)] duration-500 focus:outline-1 outline-white/30  shadow-black"
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        className="btn border border-black/80 hover:!shadow-white/30 hover:!shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-white/30"
        onClick={login}
      >
        <span className="btn-text-one">Login</span>
        <span className="btn-text-two">Dashbaord!</span>
      </button>
      <button
        className="mt-2 z-10 relative group"
        onClick={() => router.push("/signup")}
      >
        No account? Sign up
        <span className="absolute left-0 -bottom-0.5 h-[1px] w-full origin-left scale-x-0 bg-white transition-transform duration-500 group-hover:scale-x-100 group-hover:origin-left" />
      </button>
    </div>
  );
};

export default Page;
