// index.cjs

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const apiRoutes = require("./routes/api.cjs");
require("dotenv").config(); // ✅ Load .env

const app = express();
const PORT = process.env.PORT || 5000;

// connect to Mongo
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Health‐check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// mount your API router
app.use("/api", apiRoutes);

// start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
