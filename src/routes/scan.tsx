// src/routes/scan.tsx

import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function Scan() {
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleSubmit = async () => {
    if (!image) {
      setError("Please upload an image.");
      return;
    }
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", image);

    try {
      const response = await axios.post(
        "http://localhost:5001/detect",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const result = response.data;
      console.log("Backend response:", result);

      if (result.success && Array.isArray(result.output_images)) {
        navigate("/scanresult", {
          state: { outputImages: result.output_images },
        });
      } else {
        setError(result.error || "Something went wrong. Try again.");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError("Failed to upload image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-20">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Room Scan Upload
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload an image of your room:
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                       file:rounded-full file:border-0
                       file:text-sm file:font-semibold
                       file:bg-blue-50 file:text-blue-700
                       hover:file:bg-blue-100"
          />
        </div>

        {previewUrl && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
            <img
              src={previewUrl}
              alt="Room preview"
              className="w-full max-w-md rounded-md shadow"
            />
          </div>
        )}

        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <Button onClick={handleSubmit} disabled={loading} className="mt-2">
          {loading ? "Scanning..." : "Start Scan"}
        </Button>
      </div>
    </div>
  );
}
