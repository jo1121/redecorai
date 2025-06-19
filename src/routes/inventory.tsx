import { useState } from "react";
import { useNavigate } from "react-router-dom";

const mockInventory = [
  {
    id: "item001",
    name: "Modern Floor Lamp",
    category: "Lighting",
    image: "/lamp.jpg",
    status: "saved",
  },
  {
    id: "item002",
    name: "Cozy Armchair",
    category: "Furniture",
    image: "/chair.jpg",
    status: "saved",
  },
];

export default function Inventory() {
  const [items, setItems] = useState(mockInventory);
  const navigate = useNavigate();

  const markUsed = (id: string) => {
    setItems(
      items.map((item) => (item.id === id ? { ...item, status: "used" } : item))
    );
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const listForSale = (item: any) => {
    localStorage.setItem("itemToSell", JSON.stringify(item));
    navigate("/marketplace");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-center">
          📦 My Room Inventory
        </h1>

        {items.length === 0 ? (
          <p className="text-center text-gray-500">
            No items saved yet. Start by scanning your room!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white shadow rounded-lg p-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="rounded w-full h-40 object-cover mb-2"
                />
                <h2 className="text-lg font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="text-xs text-gray-400 mt-1">
                  Status: {item.status}
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => markUsed(item.id)}
                    className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                  >
                    Mark as Used
                  </button>
                  <button
                    onClick={() => listForSale(item)}
                    className="text-xs bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded"
                  >
                    Sell
                  </button>
                  <button
                    onClick={() => deleteItem(item.id)}
                    className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
