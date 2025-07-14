// src/routes/ScanResult.tsx

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface LocationState {
  outputImages?: string[];
  detectionResult?: {
    objects?: { name: string; category: string }[];
  };
  // you can extend this if you passed more state
}

export default function ScanResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const outputImages = state.outputImages || [];
  const detectedObjects = state.detectionResult?.objects || [];
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddToInventory = async () => {
    if (detectedObjects.length === 0) {
      setError("No items to add.");
      return;
    }

    setAdding(true);
    setError(null);

    try {
      // Adjust the URL to match your backend's inventory POST endpoint
      const API = import.meta.env.VITE_API_URL || "http://localhost:5001";
      await axios.post(
        `${API}/inventory`,
        { items: detectedObjects },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      // On success, navigate to inventory
      navigate("/inventory");
    } catch (err: any) {
      console.error("Add to inventory error:", err);
      setError(err.response?.data?.error || "Failed to add items.");
    } finally {
      setAdding(false);
    }
  };

  if (outputImages.length === 0 && detectedObjects.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-semibold mb-4 text-red-600">
          No processed images or items found.
        </h2>
        <Button onClick={() => navigate("/scan")}>Back to Scan</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-20">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Scan Results</h1>

        {outputImages.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {outputImages.map((url, idx) => (
              <img
                key={idx}
                src={`http://localhost:5001${url}`}
                alt={`Result ${idx + 1}`}
                className="w-full rounded shadow"
              />
            ))}
          </div>
        )}

        {detectedObjects.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2 text-gray-700">
              Detected Objects:
            </h2>
            <ul className="list-disc list-inside text-gray-800">
              {detectedObjects.map((obj, i) => (
                <li key={i}>
                  {obj.name}{" "}
                  <span className="text-sm text-gray-500">
                    ({obj.category})
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="flex gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => navigate("/scan")}
            disabled={adding}
          >
            Scan Again
          </Button>
          <Button onClick={handleAddToInventory} disabled={adding}>
            {adding ? "Adding…" : "Add to Inventory"}
          </Button>
        </div>
      </div>
    </div>
  );
}
