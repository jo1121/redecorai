const express = require("express");
const multer = require("multer");
const bcrypt = require("bcrypt");
const axios = require("axios");
const router = express.Router();
// Note the exact ".js" extension and case-match your filenames
const User = require("../models/User.js");
const Inventory = require("../models/Inventory.js");
const Marketplace = require("../models/Marketplace.js");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();

// ML Service configuration
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || "http://localhost:5001";

// ✅ Multer image upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Health check endpoint
router.get("/health", async (req, res) => {
  try {
    // Check ML service connection
    let mlStatus = "disconnected";
    try {
      const response = await axios.get(`${ML_SERVICE_URL}/health`, {
        timeout: 5000,
      });
      mlStatus = response.status === 200 ? "connected" : "disconnected";
    } catch (error) {
      mlStatus = "disconnected";
    }

    res.json({
      status: "healthy",
      backend: "connected",
      ml_service: mlStatus,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      error: error.message,
    });
  }
});

// ✅ GET all inventory
router.get("/inventory", async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json({
      success: true,
      inventory: items,
      total: items.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

// ✅ POST new inventory item
router.post("/inventory", async (req, res) => {
  try {
    const {
      name,
      category,
      description,
      confidence,
      detectionMethod,
      imagePath,
    } = req.body;

    const newItem = new Inventory({
      name,
      category,
      description,
      confidence,
      detectionMethod: detectionMethod || "manual",
      imagePath,
      status: "detected",
      createdAt: new Date(),
    });

    await newItem.save();

    res.status(201).json({
      success: true,
      item: newItem,
      message: "Item added to inventory",
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add inventory item" });
  }
});

// ✅ GET marketplace
router.get("/marketplace", async (req, res) => {
  try {
    const { category, minPrice, maxPrice, status = "available" } = req.query;

    let filter = { status };

    if (category) filter.category = category;
    if (minPrice) filter.price = { $gte: parseFloat(minPrice) };
    if (maxPrice)
      filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };

    const items = await Marketplace.find(filter);

    res.json({
      success: true,
      items,
      total: items.length,
      filters_applied: { category, minPrice, maxPrice, status },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load marketplace items." });
  }
});

// ✅ POST marketplace item + remove from inventory
router.post("/marketplace", async (req, res) => {
  const { name, price, category, location, image, inventoryId } = req.body;
  if (!name || !price || !category || !location || !image)
    return res.status(400).json({ error: "All fields are required." });

  try {
    const newItem = new Marketplace({
      name,
      price,
      category,
      location,
      image,
      status: "available",
      listedAt: new Date(),
    });
    await newItem.save();

    if (inventoryId) {
      await Inventory.findByIdAndUpdate(inventoryId, { status: "listed" });
    }

    res.status(201).json({
      success: true,
      message: "Item added to marketplace!",
      marketplace_item: newItem,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to add item to marketplace." });
  }
});

// ✅ AI Object Detection - Enhanced with ML service integration
router.post("/detect-objects", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  try {
    // Forward image to ML service
    const FormData = require("form-data");
    const fs = require("fs");

    const form = new FormData();
    form.append("file", fs.createReadStream(req.file.path), {
      filename: req.file.filename,
      contentType: req.file.mimetype,
    });

    const response = await axios.post(`${ML_SERVICE_URL}/detect`, form, {
      headers: {
        ...form.getHeaders(),
      },
      timeout: 30000,
    });

    if (response.status === 200) {
      const detectionResult = response.data;

      // Save detected objects to inventory
      const inventoryItems = [];

      for (const obj of detectionResult.objects || []) {
        const inventoryItem = new Inventory({
          name: obj.name || "Unknown Object",
          category: obj.category || "miscellaneous",
          confidence: obj.confidence || 0,
          detectionMethod: "ai_scan",
          imagePath: `/uploads/${req.file.filename}`,
          bbox: obj.bbox || [],
          status: "detected",
          source: "camera_scan",
          createdAt: new Date(),
        });

        await inventoryItem.save();
        inventoryItems.push(inventoryItem);
      }

      res.json({
        success: true,
        message: "Objects detected successfully",
        detection_result: detectionResult,
        inventory_items: inventoryItems,
        items_added: inventoryItems.length,
        image_url: `/uploads/${req.file.filename}`,
      });
    } else {
      throw new Error("ML service returned error");
    }
  } catch (error) {
    console.error("Detection error:", error);

    if (error.code === "ECONNREFUSED") {
      return res.status(503).json({
        error: "Could not connect to ML service",
        details: "Make sure the ML service is running on port 5001",
      });
    }

    res.status(500).json({
      error: "Object detection failed",
      details: error.message,
    });
  }
});

// ✅ Image upload (keep existing)
router.post("/upload-room", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No image uploaded" });

  res.json({
    message: "Image uploaded successfully",
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});

// ✅ Root test
router.get("/", (req, res) => {
  res.json({ message: "ReDecorAI backend is working!" });
});

// ✅ Register
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;
  console.log("Register attempt:", { username, email }); // Log attempt
  if (!username || !email || !password)
    return res.status(400).json({ error: "All fields are required." });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    console.log("User registered:", email); // Log success
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("Registration error:", err); // Log error
    res
      .status(500)
      .json({ error: err.message || "Server error during registration." });
  }
});

/// ✅ Login using username OR email
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ error: "Username or email and password are required." });

  try {
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!user)
      return res.status(401).json({ error: "Invalid username or email." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid password." });

    // ✅ Return with optional token for frontend
    res.status(200).json({
      message: "Login successful!",
      user,
      token: "example-token-123", // 🔐 Replace with real JWT in future
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during login." });
  }
});

// ✅ Google auth
router.post("/google-signup", async (req, res) => {
  const { token } = req.body;
  if (!token)
    return res.status(400).json({ error: "Google token is required." });

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience:
        "590880356078-3aa0c2po8kkatp67j5c84v1hq5c5gb2f.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = new User({ username: name, email, password: hashedPassword });
      await user.save();
    }

    res.status(200).json({ message: "Google sign-in successful!", user });
  } catch (err) {
    res.status(500).json({ error: "Google sign-in failed." });
  }
});

// ✅ Enhanced AI suggestion with ML integration
router.get("/scan-result/:filename", async (req, res) => {
  const { filename } = req.params;

  try {
    // Try to get results from ML service if available
    const mlResponse = await axios.get(`${ML_SERVICE_URL}/categories`, {
      timeout: 5000,
    });

    if (mlResponse.status === 200) {
      // Generate dynamic suggestions based on ML categories
      const categories = mlResponse.data.categories;
      const sampleResults = [];

      Object.keys(categories).forEach((category) => {
        const items = categories[category];
        const randomItem = items[Math.floor(Math.random() * items.length)];
        sampleResults.push({
          name: randomItem.charAt(0).toUpperCase() + randomItem.slice(1),
          description: `A stylish ${randomItem} perfect for modern interiors.`,
          image: "/placeholder.jpg",
          category: category,
        });
      });

      res.json(sampleResults.slice(0, 3));
    } else {
      throw new Error("ML service unavailable");
    }
  } catch (error) {
    // Fallback to static suggestions
    const sampleResults = [
      {
        name: "Minimalist Lamp",
        description: "A stylish lamp perfect for modern interiors.",
        image: "/placeholder.jpg",
        category: "lighting",
      },
      {
        name: "Wooden Shelf",
        description: "Rustic wooden shelf to enhance your storage space.",
        image: "/placeholder.jpg",
        category: "furniture",
      },
      {
        name: "Indoor Plant",
        description: "Low-maintenance plant to bring greenery inside.",
        image: "/placeholder.jpg",
        category: "plants",
      },
    ];
    res.json(sampleResults);
  }
});

// ✅ DEBUG ROUTES
router.get("/debug-users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get("/create-test-user", async (req, res) => {
  const hashedPassword = await bcrypt.hash("12345", 10);
  const user = new User({
    username: "sudheer",
    email: "sudheer@gmail.com",
    password: hashedPassword,
  });
  await user.save();
  res.json({ message: "Test user created", user });
});

module.exports = router;
