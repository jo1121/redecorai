// index.cjs
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api.cjs");

const app = express();
const PORT = process.env.PORT || 5000;

// Debug: print the MONGO_URI
console.log("🔍 MONGO_URI =", process.env.MONGO_URI);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Debug: log every incoming request
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl} from`, req.headers.origin);
  next();
});

// CORS: only allow your Codespace-hosted front end
const FRONTEND = process.env.FRONTEND_URL;
if (!FRONTEND) {
  console.warn("⚠️ FRONTEND_URL not set in .env – all origins will be allowed");
}
console.log("FRONTEND_URL from .env:", FRONTEND);
app.use(
  cors({
    origin: true, // TEMP: allow all origins for debugging
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Ensure Access-Control-Allow-Credentials is always set
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  next();
});

// Body parsing & static uploads
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Mount your API router at /api
app.use("/api", apiRoutes);

// Health‐check route
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Root route
app.get("/", (_req, res) => {
  res.send("Backend is running ✅");
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
