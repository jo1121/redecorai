const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;

app.get('/check-connection', (req, res) => {
  res.json({ backend: true, database: mongoose.connection.readyState === 1 });
});

mongoose.connect('mongodb://mongo:27017/mydb')
  .then(() => {
    app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });
