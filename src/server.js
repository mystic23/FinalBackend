// src/server.js
const express = require('express');
const app = express();

const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reservationRoutes = require('./routes/reservationRoutes');

app.use(express.json());

app.use('/api', authRoutes);
app.use('/api', bookRoutes);
app.use('/api', reservationRoutes);

app.get('/', (req, res) => {
  res.send('Express OK');
});

const PORT = 5051;

app.listen(PORT, () => {
  console.log(`Express escuchando en puerto ${PORT}`);
});
