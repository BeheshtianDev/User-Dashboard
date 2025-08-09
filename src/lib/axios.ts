import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});
export const auth: { username: string; password: string }[] = [];

export const TOKEN = "fake-jwt-token";
export type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  bio?: string;
  phone?: string;
};

export const users: User[] = [
  {
    id: 1,
    name: "Ali",
    email: "ali@example.com",
    role: "active",
    joinedAt: "2025-08-01",
    bio: "Frontend developer with 5 years of experience",
    phone: "09121234567",
  },
  {
    id: 2,
    name: "Sara",
    email: "sara@example.com",
    role: "inactive",
    joinedAt: "2025-07-15",
    bio: "Marketing expert, loves data analytics",
    phone: "09361234567",
  },
];
export default api;
