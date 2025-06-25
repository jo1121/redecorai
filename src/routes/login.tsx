import React, { useState } from "react";
import axios from "axios"; // ✅ Added for backend API call
import PageWrapper from "../components/PageWrapper";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ✅ Connected to backend /api/register
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/register", {
        username,
        email,
        password,
      });
      console.log("✅ Registered:", res.data);
      alert(res.data.message); // Success popup
    } catch (err: any) {
      console.error("❌ Register failed:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <PageWrapper>
      <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
      <div className="space-y-4">
        <button className="w-full border py-2 rounded hover:bg-gray-100 bg-white text-black">
          Continue with Google
        </button>
        <button className="w-full border py-2 rounded hover:bg-gray-100 bg-white text-black">
          Continue with Facebook
        </button>
        <div className="text-center text-sm text-gray-500">
          or sign up with email
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              type="text"
              placeholder="Choose a username"
              className="w-full border px-3 py-2 rounded bg-white text-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border px-3 py-2 rounded bg-white text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full border px-3 py-2 rounded bg-white text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
