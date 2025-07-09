import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface MarketplaceItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  location: string;
  image: string;
}

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [items, setItems] = useState<MarketplaceItem[]>([]);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/marketplace`)
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Error fetching marketplace items:", err));
  }, []);

  const filteredItems = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || item.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back to Home & Title */}
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="text-blue-600 hover:underline">
          &larr; Back to Home
        </Link>
        <h1 className="text-2xl font-bold">Marketplace</h1>
      </div>

      {/* Search + Filter Controls */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search items..."
          className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full md:w-1/4 px-4 py-2 border border-gray-300 rounded"
        >
          <option value="All">All Categories</option>
          <option value="Lighting">Lighting</option>
          <option value="Rugs">Rugs</option>
          <option value="Plants">Plants</option>
        </select>
      </div>

      {/* Item Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <div key={item._id} className="bg-white p-4 shadow rounded-lg">
            <img
              src={item.image}
              alt={item.name}
              className="rounded w-full mb-2"
            />
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-500">
              ${item.price} • {item.location}
            </p>
            <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View Details
            </button>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <p className="text-center col-span-full text-gray-500">
            No items found.
          </p>
        )}
      </div>
    </div>
  );
}
