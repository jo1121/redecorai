import { useState } from "react";

const dummyItems = [
  {
    id: 1,
    name: "Vintage Lamp",
    price: 30,
    category: "Lighting",
    location: "New York",
    image: "/placeholder.jpg",
  },
  {
    id: 2,
    name: "Boho Carpet",
    price: 50,
    category: "Rugs",
    location: "Chicago",
    image: "/placeholder.jpg",
  },
  {
    id: 3,
    name: "Fiddle Leaf Plant",
    price: 25,
    category: "Plants",
    location: "San Francisco",
    image: "/placeholder.jpg",
  },
];

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const filteredItems = dummyItems.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || item.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Marketplace</h1>

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
            <div key={item.id} className="bg-white p-4 shadow rounded-lg">
              <img
                src={item.image}
                alt={item.name}
                className="rounded w-full mb-2"
              />
              <h2 className="text-lg font-semibold">{item.name}</h2>
              <p className="text-sm text-gray-500">
                ${item.price} • {item.location}
              </p>
              <button className="mt-2 text-blue-600 hover:underline">
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
    </div>
  );
}
