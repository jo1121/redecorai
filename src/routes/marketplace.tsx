import React, { useEffect, useState } from "react";
import { Search, Filter, AlertCircle, Loader2, ArrowLeft, ShoppingBag, MapPin, DollarSign } from "lucide-react";

interface MarketplaceItem {
  _id: string;
  name: string;
  price: number;
  category: string;
  location: string;
  image: string;
}

const MarketplacePage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API base URL - update this to match your backend
  const API_BASE_URL = 'http://localhost:3001';

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`${API_BASE_URL}/api/marketplace`);
        const data = await response.json();
        
        if (response.ok) {
          // Ensure data is an array
          setItems(Array.isArray(data) ? data : []);
        } else {
          throw new Error(data.error || 'Failed to fetch marketplace items');
        }
      } catch (err) {
        console.error("Error fetching marketplace items:", err);
        if (err instanceof Error) {
          setError(err.message || 'Failed to load marketplace items. Make sure the backend is running.');
        } else {
          setError('Failed to load marketplace items. Make sure the backend is running.');
        }
        setItems([]); // Ensure items is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  // Safe filter - ensure items is always an array
  const filteredItems = Array.isArray(items) ? items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === "All" || item.category === category;
    return matchSearch && matchCategory;
  }) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Home
            </button>
            <h1 className="text-xl font-semibold text-white">Marketplace</h1>
            <div className="w-24"></div> {/* Spacer */}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            🛍️ Furniture Marketplace
          </h2>
          <p className="text-white/80">
            Discover and purchase furniture items to complete your room design
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search items..."
                className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="pl-10 pr-8 py-3 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Lighting">Lighting</option>
                <option value="Rugs">Rugs</option>
                <option value="Plants">Plants</option>
                <option value="Furniture">Furniture</option>
                <option value="Decor">Decor</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-white/60 mx-auto mb-4" />
            <p className="text-white/80">Loading marketplace items...</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <p className="text-red-200">{error}</p>
            </div>
          </div>
        )}

        {/* Items Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item._id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors">
                <div className="aspect-square bg-white/20 rounded-lg mb-4 overflow-hidden relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-white/60 bg-white/10">
                    <ShoppingBag className="w-12 h-12" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-white mb-2">{item.name}</h3>
                
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="w-4 h-4 text-green-400" />
                  <span className="text-green-300 font-medium">${item.price}</span>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-4 h-4 text-white/60" />
                  <span className="text-white/70 text-sm">{item.location}</span>
                </div>
                
                <div className="flex gap-2">
                  <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                    Buy
                  </button>
                </div>
                
                <span className="inline-block mt-2 px-2 py-1 bg-white/20 text-white/80 text-xs rounded">
                  {item.category}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredItems.length === 0 && (
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center">
            <ShoppingBag className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No items found</h3>
            <p className="text-white/70">
              {search || category !== "All" 
                ? "Try adjusting your search or filter criteria"
                : "No marketplace items available at the moment"
              }
            </p>
          </div>
        )}

        {/* Debug Info */}
        <details className="mt-6 bg-white/5 rounded-lg p-4">
          <summary className="cursor-pointer text-white/80 font-medium">
            🔍 Debug Information
          </summary>
          <div className="mt-3 space-y-2 text-sm">
            <p className="text-white/70">
              <strong>Backend URL:</strong> {API_BASE_URL}
            </p>
            <p className="text-white/70">
              <strong>Total items:</strong> {items.length}
            </p>
            <p className="text-white/70">
              <strong>Filtered items:</strong> {filteredItems.length}
            </p>
            <p className="text-white/70">
              <strong>Current search:</strong> {search || 'None'}
            </p>
            <p className="text-white/70">
              <strong>Current category:</strong> {category}
            </p>
            <p className="text-white/70">
              <strong>Loading:</strong> {loading ? 'Yes' : 'No'}
            </p>
            <p className="text-white/70">
              <strong>Error:</strong> {error || 'None'}
            </p>
          </div>
        </details>
      </div>
    </div>
  );
};

export default MarketplacePage;
