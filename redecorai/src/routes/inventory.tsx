import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

interface InventoryItem {
  _id: string;
  name: string;
  category: string;
  image?: string;
}

export default function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/inventory`,
          {
            withCredentials: true,
          }
        );
        setItems(res.data);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to load inventory.");
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Back to Home Button */}
      <div className="mb-6">
        <Link to="/" className="inline-block text-blue-600 hover:underline">
          &larr; Back to Home
        </Link>
      </div>

      <h1 className="text-3xl font-semibold mb-4 flex items-center gap-2">
        📦 My Room Inventory
      </h1>

      {loading && <p>Loading inventory...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length === 0 ? (
            <p>No items saved yet. Start by scanning your room!</p>
          ) : (
            items.map((item) => (
              <div
                key={item._id}
                className="border rounded-lg overflow-hidden shadow"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="font-medium text-lg">{item.name}</h2>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
