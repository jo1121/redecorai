const express = require('express');
const multer = require('multer');
const bcrypt = require('bcrypt');
const router = express.Router();
const User = require('../models/User');
const Inventory = require('../models/Inventory');
const Marketplace = require('../models/Marketplace');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();

// ✅ Multer image upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

// ✅ GET all inventory
router.get('/inventory', async (req, res) => {
  try {
    const items = await Inventory.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// ✅ GET marketplace
router.get('/marketplace', async (req, res) => {
  try {
    const items = await Marketplace.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load marketplace items.' });
  }
});

// ✅ POST marketplace item + remove from inventory
router.post('/marketplace', async (req, res) => {
  const { name, price, category, location, image, inventoryId } = req.body;
  if (!name || !price || !category || !location || !image)
    return res.status(400).json({ error: 'All fields are required.' });

  try {
    const newItem = new Marketplace({ name, price, category, location, image });
    await newItem.save();

    if (inventoryId) {
      await Inventory.findByIdAndDelete(inventoryId);
    }

    res.status(201).json({ message: 'Item added to marketplace!', item: newItem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item to marketplace.' });
  }
});

// ✅ Image upload
router.post('/upload-room', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded' });

  res.json({
    message: 'Image uploaded successfully',
    filename: req.file.filename,
    path: `/uploads/${req.file.filename}`,
  });
});

// ✅ Root test
router.get('/', (req, res) => {
  res.json({ message: 'ReDecorAI backend is working!' });
});

// ✅ Register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: 'All fields are required.' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: 'Email already registered.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

/// ✅ Login using username OR email
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Username or email and password are required.' });

  try {
    const user = await User.findOne({
      $or: [{ username: username }, { email: username }],
    });

    if (!user)
      return res.status(401).json({ error: 'Invalid username or email.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: 'Invalid password.' });

    // ✅ Return with optional token for frontend
    res.status(200).json({
      message: 'Login successful!',
      user,
      token: 'example-token-123' // 🔐 Replace with real JWT in future
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});

// ✅ Google auth
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
    res.status(500).json({ error: 'Google sign-in failed.' });
  }
});

// ✅ Mock AI suggestion
router.get('/scan-result/:filename', async (req, res) => {
  const { filename } = req.params;
  const sampleResults = [
    {
      name: 'Minimalist Lamp',
      description: 'A stylish lamp perfect for modern interiors.',
      image: '/placeholder.jpg',
    },
    {
      name: 'Wooden Shelf',
      description: 'Rustic wooden shelf to enhance your storage space.',
      image: '/placeholder.jpg',
    },
    {
      name: 'Indoor Plant',
      description: 'Low-maintenance plant to bring greenery inside.',
      image: '/placeholder.jpg',
    },
  ];
  res.json(sampleResults);
});

// ✅ DEBUG ROUTES
router.get('/debug-users', async (req, res) => {
  const users = await User.find();
  res.json(users);
});

router.get('/create-test-user', async (req, res) => {
  const hashedPassword = await bcrypt.hash("12345", 10);
  const user = new User({
    username: "sudheer",
    email: "sudheer@gmail.com",
    password: hashedPassword
  });
  await user.save();
  res.json({ message: "Test user created", user });
});

module.exports = router;
