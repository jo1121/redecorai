const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');

// Multer image upload setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Test route
router.get('/', (req, res) => {
  res.json({ message: "ReDecorAI backend is working!" });
});

// ✅ Image upload route
router.post('/upload-room', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  res.json({
    message: 'Image uploaded successfully',
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`
  });
});

// ✅ Register user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "All fields are required." });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: "Email already registered." });
    }

    // Hash password (secure!)
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    console.error("❌ Error in /register:", err.message, err.stack);
    res.status(500).json({ error: "Server error during registration." });
  }
});

// ✅ Login user
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password." });
    }

    res.status(200).json({ message: "Login successful!", user });
  } catch (err) {
    console.error("❌ Error in /login:", err.message, err.stack);
    res.status(500).json({ error: "Server error during login." });
  }
});

module.exports = router;
