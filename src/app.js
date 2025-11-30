// src/app.js
const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');   // 👈 IMPORTANTE

const app = express();

app.use(cors());
app.use(express.json());

app.get('/ping', (req, res) => {
  res.json({ message: 'pong' });
});

app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);                   // 👈 REGISTRAR RUTA

module.exports = app;
