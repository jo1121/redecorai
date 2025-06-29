const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const apiRoutes = require('./routes/api.cjs');
require('dotenv').config(); // ✅ Load .env
require('dotenv').config();
console.log("🧪 MONGO_URI from .env:", process.env.MONGO_URI);


const app = express();
const PORT = 5000;

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(process.env.MONGO_URI, { dbName: 'redecorai' })
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection failed:", err));

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api', apiRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});
