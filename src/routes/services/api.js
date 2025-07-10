const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    // Remove Content-Type for FormData
    if (options.body instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    try {
      const response = await fetch(url, config);

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = { message: await response.text() };
      }

      if (!response.ok) {
        throw new Error(
          data.error || data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Health check
  async checkHealth() {
    return this.request("/api/health");
  }

  // Object detection
  async detectObjects(file) {
    const formData = new FormData();
    formData.append("image", file);

    return this.request("/api/detect-objects", {
      method: "POST",
      body: formData,
    });
  }

  // Inventory management
  async getInventory() {
    return this.request("/api/inventory");
  }

  async addInventoryItem(item) {
    return this.request("/api/inventory", {
      method: "POST",
      body: JSON.stringify(item),
    });
  }

  // Marketplace
  async getMarketplace(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = `/api/marketplace${queryString ? `?${queryString}` : ""}`;
    return this.request(endpoint);
  }

  async addToMarketplace(marketplaceData) {
    return this.request("/api/marketplace", {
      method: "POST",
      body: JSON.stringify(marketplaceData),
    });
  }

  // Image upload
  async uploadRoom(file) {
    const formData = new FormData();
    formData.append("image", file);

    return this.request("/api/upload-room", {
      method: "POST",
      body: formData,
    });
  }

  // Get scan results
  async getScanResult(filename) {
    return this.request(`/api/scan-result/${filename}`);
  }

  // Authentication
  async register(userData) {
    return this.request("/api/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    return this.request("/api/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async googleSignup(token) {
    return this.request("/api/google-signup", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  }
}

export default new ApiService();
