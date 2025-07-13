import React, { useState, useEffect } from "react";
import { useHealthCheck } from "../../hooks/useApi";

const IntegrationStatus = ({ className = "" }) => {
  const { data: healthData, loading, error } = useHealthCheck();

  const getStatusInfo = () => {
    if (loading)
      return { status: "checking", color: "yellow", text: "Checking..." };
    if (error) return { status: "error", color: "red", text: "Disconnected" };
    if (healthData?.ml_service === "connected")
      return { status: "connected", color: "green", text: "All Connected" };
    return { status: "partial", color: "yellow", text: "Backend Only" };
  };

  const { status, color, text } = getStatusInfo();

  const colorClasses = {
    green: "bg-green-100 text-green-800 border-green-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
    red: "bg-red-100 text-red-800 border-red-200",
  };

  const dotColors = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    red: "bg-red-500",
  };

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${colorClasses[color]} ${className}`}
    >
      <div
        className={`w-2 h-2 rounded-full mr-2 ${dotColors[color]} ${
          loading ? "animate-pulse" : ""
        }`}
      />
      {text}
    </div>
  );
};

export default IntegrationStatus;
