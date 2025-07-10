import { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";

interface Suggestion {
  name: string;
  description: string;
  image: string;
}

export default function ScanResult() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const filename = queryParams.get("file");

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (filename) {
      axios
        .get(`${import.meta.env.VITE_API_URL}/scan-result/${filename}`)
        .then((res) => {
          setSuggestions(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("❌ Failed to fetch scan result:", err);
          setError("Failed to fetch suggestions.");
          setLoading(false);
        });
    } else {
      setLoading(false);
      setError("No file provided.");
    }
  }, [filename]);

  // Only show if we have detected items
  const handleAddToInventory = async () => {
    try {
      await Promise.all(
        suggestions.map((item) =>
          axios.post(`${import.meta.env.VITE_API_URL}/inventory`, item)
        )
      );
      alert("Items added to inventory!");
    } catch (err) {
      console.error("Error adding to inventory:", err);
      alert("Failed to add items to inventory.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* Back to Home & Title */}
      <div className="mb-6 flex items-center justify-between">
        <Link to="/" className="text-blue-600 hover:underline">
          &larr; Back to Home
        </Link>
        <h1 className="text-2xl font-bold">🧠 AI Design Suggestions</h1>
      </div>

      {/* Add to Inventory button only if suggestions exist */}
      {!loading && !error && suggestions.length > 0 && (
        <button
          onClick={handleAddToInventory}
          className="mb-6 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Add to Inventory
        </button>
      )}

      {loading && <p>Loading suggestions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && suggestions.length === 0 && !error && (
        <p className="text-gray-500">
          No suggestions available yet. Try again later.
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {suggestions.map((item, index) => (
          <div key={index} className="bg-white shadow p-4 rounded-lg">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-40 object-cover mb-3 rounded"
            />
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
