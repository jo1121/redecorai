import React, { useState, useEffect } from "react";

const BackendTest = () => {
  const [backendStatus, setBackendStatus] = useState("checking...");
  const [mlStatus, setMlStatus] = useState("checking...");

  useEffect(() => {
    testConnections();
  }, []);

  const testConnections = async () => {
    // Test backend
    try {
      const response = await fetch("http://localhost:3001/health");
      const data = await response.json();
      setBackendStatus(response.ok ? "✅ Connected" : "❌ Error");
      console.log("Backend health:", data);
    } catch (error) {
      setBackendStatus("❌ Disconnected");
      console.error("Backend error:", error);
    }

    // Test ML service
    try {
      const response = await fetch("http://localhost:5001/health");
      const data = await response.json();
      setMlStatus(response.ok ? "✅ Connected" : "❌ Error");
      console.log("ML service health:", data);
    } catch (error) {
      setMlStatus("❌ Disconnected");
      console.error("ML service error:", error);
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg text-sm">
      <div className="font-medium mb-2">Service Status</div>
      <div>Backend: {backendStatus}</div>
      <div>ML Service: {mlStatus}</div>
      <button
        onClick={testConnections}
        className="mt-2 px-2 py-1 bg-blue-500 text-white rounded text-xs"
      >
        Refresh
      </button>
    </div>
  );
};

export default BackendTest;
