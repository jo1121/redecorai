import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Item {
  _id: string;
  name: string;
  category: string;
  image: string;
  status: string;
}

export default function Inventory() {
  const [items, setItems] = useState<Item[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/inventory")
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Error fetching inventory:", err));
  }, []);

  const markUsed = (id: string) => {
    setItems(
      items.map((item) =>
        item._id === id ? { ...item, status: "used" } : item
      )
    );
    // Optionally: axios.patch(`/api/inventory/${id}`, { status: "used" });
  };

  const deleteItem = (id: string) => {
    setItems(items.filter((item) => item._id !== id));
    // Optionally: axios.delete(`/api/inventory/${id}`);
  };

  const listForSale = async (item: Item) => {
    const priceStr = window.prompt("Enter price:", "25");
    const location = window.prompt("Enter location:", "YourCity");

    if (!priceStr || !location) {
      alert("Price and location are required.");
      return;
    }

    const price = parseFloat(priceStr);
    if (isNaN(price)) {
      alert("Price must be a valid number.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/marketplace", {
        name: item.name,
        price,
        category: item.category,
        location,
        image: item.image,
        inventoryId: item._id, // this tells backend to also remove from inventory
      });

      setItems((prevItems) => prevItems.filter((i) => i._id !== item._id)); // frontend update
      navigate("/marketplace");
    } catch (err) {
      console.error("❌ Error listing item:", err);
    }
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
              <div key={item._id} className="bg-white shadow rounded-lg p-4">
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
                    onClick={() => markUsed(item._id)}
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
                    onClick={() => deleteItem(item._id)}
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
