// src/lib/data.ts
export type User = { id: number; name: string; email: string };
export const users: User[] = [
  { id: 1, name: "Ali", email: "ali@example.com" },
  { id: 2, name: "Sara", email: "sara@example.com" },
];
export const auth: { username: string; password: string }[] = [];
export const TOKEN = "fake-jwt-token";
