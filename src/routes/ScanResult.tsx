import React, { useState } from "react";
import { useLocation } from "react-router-dom";

export default function ScanResult() {
  const location = useLocation();
  const image = location.state?.image;
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [inventoryAdded, setInventoryAdded] = useState(false);

  const handleAddToInventory = () => {
    const isLoggedIn = localStorage.getItem("user") === "true";
    if (!isLoggedIn) {
      setShowAuthModal(true);
    } else {
      setInventoryAdded(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfcf9] text-gray-800 px-4 py-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">Scan Result</h1>

      {image ? (
        <img
          src={image}
          alt="Scanned Room"
          className="w-full max-w-md rounded shadow mb-6"
        />
      ) : (
        <p>No image found.</p>
      )}

      <div className="max-w-xl w-full text-left bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Detected Items</h2>
        <ul className="list-disc list-inside text-sm text-gray-600 mb-4">
          <li>Bed</li>
          <li>Chair</li>
          <li>Study Table</li>
          <li>Lamp</li>
        </ul>

        <button
          onClick={handleAddToInventory}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded"
        >
          Add Items to Inventory
        </button>

        {inventoryAdded && (
          <p className="mt-4 text-green-600 font-medium">
            Items added to your inventory!
          </p>
        )}
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold mb-4">
              {isSignup ? "Sign Up" : "Login"}
            </h2>

            {isSignup ? (
              <SignupForm
                onSuccess={() => {
                  setShowAuthModal(false);
                  setInventoryAdded(true);
                }}
              />
            ) : (
              <LoginForm
                onSuccess={() => {
                  setShowAuthModal(false);
                  setInventoryAdded(true);
                }}
              />
            )}

            <p className="text-sm text-gray-600 mt-4">
              {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
              <button
                className="text-blue-600 underline"
                onClick={() => setIsSignup(!isSignup)}
              >
                {isSignup ? "Login" : "Sign up"}
              </button>
            </p>

            <button
              onClick={() => setShowAuthModal(false)}
              className="mt-4 text-sm text-gray-500 underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Login form
function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      localStorage.setItem("user", "true");
      onSuccess();
    } else {
      alert("Please fill in both fields.");
    }
  };

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-3">
      <input
        type="email"
        placeholder="Email"
        value={email}
        className="border px-4 py-2 rounded"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        className="border px-4 py-2 rounded"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        Login
      </button>
    </form>
  );
}

// Signup form
function SignupForm({ onSuccess }: { onSuccess: () => void }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && email && password) {
      localStorage.setItem("user", "true");
      onSuccess();
    } else {
      alert("Please fill all fields.");
    }
  };

  return (
    <form onSubmit={handleSignup} className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="Username"
        value={username}
        className="border px-4 py-2 rounded"
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        className="border px-4 py-2 rounded"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        className="border px-4 py-2 rounded"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white py-2 rounded"
      >
        Sign Up
      </button>
    </form>
  );
}
