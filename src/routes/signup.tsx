import React, { useState } from "react";
import axios from "axios";
import PageWrapper from "../components/PageWrapper";
import { GoogleLogin } from "@react-oauth/google";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");

  // Pull your API base URL from Vite env
  const API = import.meta.env.VITE_API_URL;

  // ✅ Manual Sign Up Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = `${API}/register`;
    console.log("🔍 Register URL:", url);

    try {
      const res = await axios.post(url, {
        username,
        email,
        password,
      });
      console.log("✅ Registered:", res.data);
      alert(res.data.message);
    } catch (err: any) {
      console.error("❌ Register failed:", err.response?.data || err.message);
      alert(err.response?.data?.error || "Registration failed");
    }
  };

  // ✅ Google Sign Up
  const handleGoogleSuccess = async (credentialResponse: any) => {
    console.log("🔍 Google credential:", credentialResponse);
    const url = `${API}/google-signup`;
    console.log("🔍 Google Signup URL:", url);

    try {
      const res = await axios.post(url, {
        token: credentialResponse.credential,
      });
      console.log("✅ Google signup:", res.data);
      alert(res.data.message || "Google sign-up success");
    } catch (err: any) {
      console.error("❌ Google sign-up failed:", err.response?.data || err.message);
      alert("Google sign-up failed");
    }
  };

  return (
    <PageWrapper>
      <h2 className="text-xl font-semibold mb-4">Sign Up</h2>
      <div className="space-y-4">
        <div className="w-full flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => alert("Google sign-up failed")}
          />
        </div>
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
