import React, { useState } from "react";
import ObjectDetection from "./ObjectDetection";
import IntegrationStatus from "./IntegrationStatus";
import { useInventory, useMarketplace } from "../../hooks/useApi";

const TestPage = () => {
  const [lastDetection, setLastDetection] = useState(null);
  const {
    data: inventory,
    loading: inventoryLoading,
    refetch: refetchInventory,
  } = useInventory();
  const {
    data: marketplace,
    loading: marketplaceLoading,
    refetch: refetchMarketplace,
  } = useMarketplace();

  const handleDetectionComplete = (result) => {
    setLastDetection(result);
    // Refresh inventory after detection
    refetchInventory();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              AI Object Detection
            </h1>
            <p className="text-gray-600">
              Upload an image to detect objects and add them to your inventory
            </p>
          </div>
          <IntegrationStatus />
        </div>

        {/* Detection Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">📷 Scan Your Room</h2>
          <ObjectDetection onDetectionComplete={handleDetectionComplete} />
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inventory */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">📦 Your Inventory</h2>
            {inventoryLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading inventory...</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {inventory?.inventory?.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No items yet. Upload an image to get started!
                  </p>
                ) : (
                  inventory?.inventory?.map((item) => (
                    <div key={item._id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            {item.category}
                          </p>
                          {item.confidence && (
                            <p className="text-xs text-blue-600">
                              {Math.round(item.confidence * 100)}% confidence
                            </p>
                          )}
                        </div>
                        <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Marketplace */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">🛍️ Marketplace</h2>
            {marketplaceLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading marketplace...</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {marketplace?.items?.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No items listed yet.
                  </p>
                ) : (
                  marketplace?.items?.map((item) => (
                    <div key={item._id} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            {item.category}
                          </p>
                          <p className="text-sm font-medium text-green-600">
                            ${item.price}
                          </p>
                        </div>
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                          {item.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
