import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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
        .get(`http://localhost:5000/api/scan-result/${filename}`)
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

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-6">🧠 AI Design Suggestions</h1>

      {loading && <p>Loading suggestions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && suggestions.length === 0 && !error && (
        <p className="text-gray-500">No suggestions available yet. Try again later.</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {suggestions.map((item, index) => (
          <div key={index} className="bg-white shadow p-4 rounded-lg">
            <img src={item.image} alt={item.name} className="w-full h-40 object-cover mb-3 rounded" />
            <h2 className="text-lg font-semibold">{item.name}</h2>
            <p className="text-sm text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

