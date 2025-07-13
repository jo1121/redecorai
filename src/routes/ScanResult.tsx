import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package, ShoppingCart, Loader2 } from "lucide-react";

// Define the type for a suggestion
interface Suggestion {
  name: string;
  description: string;
  category?: string;
  // Add more fields if needed
}

const ScanResultPage = () => {
  const { filename } = useParams<{ filename?: string }>();
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (filename) {
      fetchSuggestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filename]);

  const fetchSuggestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `http://localhost:3001/api/scan-result/${filename}`
      );
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
      } else {
        throw new Error("Failed to fetch suggestions");
      }
    } catch (err: unknown) {
      console.error("Error fetching suggestions:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unknown error");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white">Loading suggestions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">Error: {error}</p>
          <button
            onClick={() => navigate("/scan")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate("/scan")}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Scan
            </button>
            <h1 className="text-xl font-semibold text-white">
              Design Suggestions
            </h1>
            <div className="w-24"></div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            🎨 AI Design Suggestions
          </h2>
          <p className="text-white/80">
            Based on your room analysis, here are our recommendations
          </p>
        </div>

        {/* Suggestions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/15 transition-colors"
            >
              <div className="w-full h-48 bg-gray-300 rounded-lg mb-4 flex items-center justify-center">
                <Package className="w-16 h-16 text-gray-500" />
              </div>

              <h3 className="text-lg font-semibold text-white mb-2">
                {suggestion.name}
              </h3>

              <p className="text-white/80 text-sm mb-4">
                {suggestion.description}
              </p>

              {suggestion.category && (
                <span className="inline-block px-3 py-1 bg-blue-500/50 text-blue-200 rounded-full text-xs mb-4">
                  {suggestion.category}
                </span>
              )}

              <div className="flex gap-2">
                <button className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm">
                  Add to Wishlist
                </button>
                <button className="flex-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm">
                  <ShoppingCart className="w-4 h-4 inline mr-1" />
                  Shop
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/scan")}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            Scan Another Room
          </button>
          <button
            onClick={() => navigate("/marketplace")}
            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            Browse Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScanResultPage;
