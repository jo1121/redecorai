export const formatConfidence = (confidence) => {
  return Math.round(confidence * 100);
};

export const formatPrice = (price) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(price);
};

export const getCategoryIcon = (category) => {
  const icons = {
    furniture: "🪑",
    electronics: "📱",
    decor: "🖼️",
    lighting: "💡",
    textiles: "🛏️",
    plants: "🌱",
    miscellaneous: "📦",
  };
  return icons[category] || "📦";
};

export const getStatusColor = (status) => {
  const colors = {
    detected: "bg-blue-100 text-blue-800",
    listed: "bg-green-100 text-green-800",
    sold: "bg-gray-100 text-gray-800",
    available: "bg-green-100 text-green-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
};
