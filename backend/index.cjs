// backend/index.cjs

// Load environment variables from backend/.env
require("dotenv").config();

const express   = require("express");
const cors      = require("cors");
const mongoose  = require("mongoose");
const apiRoutes = require("./routes/api.cjs");

const app  = express();
const PORT = process.env.PORT || 5000;

// Debug: print key environment variables
console.log("🔍 MONGO_URI    =", process.env.MONGO_URI);
console.log("⚙️  FRONTEND_URL =", process.env.FRONTEND_URL);

// --- CORS SETUP ---
// Whitelist exactly your Codespace-hosted front-end URL
const allowedOrigins = [
  process.env.FRONTEND_URL,  // e.g. https://fluffy-broccoli-xxxx-5174.app.github.dev
];

// For temporary dev, you could also allow all:
// allowedOrigins.push("*");

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like curl or mobile clients)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS policy violation: ${origin}`));
  },
  credentials: true,
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"],
}));

// Body parsing and static uploads
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Log every incoming request
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.originalUrl} from`, req.headers.origin);
  next();
});

// Mount API routes under /api
app.use("/api", apiRoutes);

// Health-check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Root endpoint
app.get("/", (_req, res) => {
  res.send("Backend is running ✅");
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
