import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface DetectionResponse {
  redecoratedImageUrl: string;
  items: string[];
}

export default function ScanResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const uploadedImage = location.state?.image as string | undefined;

  const [redecoratedUrl, setRedecoratedUrl] = useState<string | null>(null);
  const [items, setItems] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!uploadedImage) return;
    setLoading(true);
    const fetchDetection = async () => {
      try {
        const form = new FormData();
        form.append("file", uploadedImage);
        const res = await fetch("/api/detect", { method: "POST", body: form });
        if (!res.ok) throw new Error("Detection failed");
        const data = (await res.json()) as DetectionResponse;
        setRedecoratedUrl(data.redecoratedImageUrl);
        setItems(data.items);
      } catch (e: any) {
        console.error(e);
        setError(e.message || "Detection failed");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDetection();
  }, [uploadedImage]);

  const handleAddToInventory = () => {
    navigate("/inventory", { state: { items } });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <div className="flex-grow px-4 py-8 flex justify-center items-center">
        {loading ? (
          <p className="text-gray-600">Analyzing image...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : redecoratedUrl ? (
          <img
            src={redecoratedUrl}
            alt="Redecorated Room"
            className="max-w-full max-h-[70vh] rounded shadow"
          />
        ) : (
          <p className="text-gray-600">No image to analyze.</p>
        )}
      </div>

      <footer className="bg-white shadow-inner py-6 px-4">
        <h2 className="text-xl font-semibold mb-4">Detected Items</h2>
        {items === null ? (
          <p className="text-gray-600">Detecting items...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-600">No items detected.</p>
        ) : (
          <ul className="flex flex-wrap gap-4 mb-4">
            {items.map((item) => (
              <li
                key={item}
                className="bg-gray-100 px-3 py-1 rounded-md text-sm"
              >
                {item}
              </li>
            ))}
          </ul>
        )}
        {items && items.length > 0 && (
          <button
            onClick={handleAddToInventory}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md"
          >
            Add Items to Inventory
          </button>
        )}
      </footer>
    </div>
  );
}
