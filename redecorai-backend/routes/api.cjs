const express = require('express');
const multer = require('multer');
const router = express.Router();

// Set up Multer to store images in /uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Health check route
router.get('/', (req, res) => {
    res.json({ message: "ReDecorAI backend is working!" });
});

// Upload image
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

// Register user (mocked)
router.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }

    console.log("Registering user:", username, email);
    res.status(200).json({ message: "User registered successfully (mocked)" });
});

// Login user (mocked)
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required." });
    }

    console.log("Logging in:", email);
    res.status(200).json({ message: "Login successful (mocked)" });
});

module.exports = router;

