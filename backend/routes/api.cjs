const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const Inventory = require('../models/Inventory');
const Marketplace = require('../models/Marketplace');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();

// ✅ GET all inventory items
router.get('/inventory', async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inventory" });
  }
});

// ✅ GET marketplace items
router.get('/marketplace', async (req, res) => {
  try {
    const items = await Marketplace.find();
    res.json(items);
  } catch (err) {
    console.error("❌ Error fetching marketplace items:", err.message);
    res.status(500).json({ error: "Failed to load marketplace items." });
  }
});

// ✅ POST: Add new item to marketplace
router.post('/marketplace', async (req, res) => {
  const { name, price, category, location, image } = req.body;

  if (!name || !price || !category || !location || !image) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    const newItem = new Marketplace({ name, price, category, location, image });
    await newItem.save();
    res.status(201).json({ message: "Item added to marketplace!", item: newItem });
  } catch (err) {
    console.error("❌ Error adding item:", err.message);
    res.status(500).json({ error: "Failed to add item to marketplace." });
  }
});

// ✅ Multer: image upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// ✅ Image upload route
router.post('/upload-room', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

  res.json({
    message: 'Image uploaded successfully',
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
});

// ✅ Root test route
router.get('/', (req, res) => {
  res.json({ message: "ReDecorAI backend is working!" });
});

// ✅ Register user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: "All fields are required." });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(409).json({ error: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Error in /register:", err.message);
    res.status(500).json({ error: "Server error during registration." });
  }
});

// ✅ Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: "Email and password are required." });

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ error: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid password." });

    res.status(200).json({ message: "Login successful!", user });
  } catch (err) {
    console.error("❌ Error in /login:", err.message);
    res.status(500).json({ error: "Server error during login." });
  }
});

// ✅ Google Sign-In / Sign-Up
router.post('/google-signup', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'Google token is required.' });

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: '590880356078-3aa0c2po8kkatp67j5c84v1hq5c5gb2f.apps.googleusercontent.com',
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

    res.status(200).json({ message: 'Google sign-in successful!', user });
  } catch (err) {
    console.error("❌ Google sign-in error:", err.message);
    res.status(500).json({ error: "Google sign-in failed." });
  }
});
// Sample AI results (temporary mock data)
router.get('/scan-result/:filename', async (req, res) => {
  const { filename } = req.params;

  // Later this will be replaced with real AI logic
  const sampleResults = [
    {
      name: "Minimalist Lamp",
      description: "A stylish lamp perfect for modern interiors.",
      image: "/placeholder.jpg"
    },
    {
      name: "Wooden Shelf",
      description: "Rustic wooden shelf to enhance your storage space.",
      image: "/placeholder.jpg"
    },
    {
      name: "Indoor Plant",
      description: "Low-maintenance plant to bring greenery inside.",
      image: "/placeholder.jpg"
    },
  ];

  console.log(`📷 Generating AI suggestions for: ${filename}`);
  res.json(sampleResults);
});

module.exports = router;
// POST: Add item to marketplace & optionally delete from inventory
router.post('/marketplace', async (req, res) => {
  const { name, price, category, location, image, inventoryId } = req.body;

  if (!name || !price || !category || !location || !image) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Save to marketplace
    const newItem = new Marketplace({ name, price, category, location, image });
    await newItem.save();

    // Remove from inventory if inventoryId is provided
    if (inventoryId) {
      await Inventory.findByIdAndDelete(inventoryId);
    }

    res.status(201).json({ message: "Item added to marketplace!", item: newItem });
  } catch (err) {
    console.error("❌ Error adding item to marketplace:", err.message);
    res.status(500).json({ error: "Failed to add item to marketplace." });
  }
});
