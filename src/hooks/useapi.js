import { useState, useEffect, useCallback } from "react";
import ApiService from "../services/api";

// Generic hook for API calls
export const useApi = (apiCall, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      setError(err.message || "An error occurred");
      console.error("API call failed:", err);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

// Hook for health check
export const useHealthCheck = () => {
  return useApi(() => ApiService.checkHealth(), []);
};

// Hook for inventory
export const useInventory = () => {
  return useApi(() => ApiService.getInventory(), []);
};

// Hook for marketplace
export const useMarketplace = (filters = {}) => {
  return useApi(
    () => ApiService.getMarketplace(filters),
    [JSON.stringify(filters)]
  );
};

// Hook for object detection
export const useObjectDetection = () => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const detect = async (file) => {
    setIsDetecting(true);
    setError(null);

    try {
      const result = await ApiService.detectObjects(file);
      setResult(result);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsDetecting(false);
    }
  };

  return { detect, isDetecting, result, error };
};
EOF;
