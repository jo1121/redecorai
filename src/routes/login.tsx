import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import PageWrapper from "@/components/PageWrapper"; // alias is already fine

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_API_URL}/login`,
        { username, password },
        { withCredentials: true }
      );

      // ✅ Show success alert
      alert(resp.data.message || "Login successful!");

      // ✅ Save token and user data
      localStorage.setItem("token", resp.data.token || "");
      localStorage.setItem("user", JSON.stringify(resp.data.user));

      // ✅ Navigate to inventory
      navigate("/inventory");
    } catch (err: any) {
      console.error("Login error", err);
      setError(err.response?.data?.error || "Invalid username or password.");
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto mt-16 p-6 bg-white rounded-xl shadow">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && (
          <div className="p-2 mb-4 text-red-700 bg-red-100 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username or Email"
            className="w-full px-4 py-2 border rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </PageWrapper>
  );
}
console.log("API URL is:", import.meta.env.VITE_API_URL);
