require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'done.html'));
});

app.get('/api/keys', (req, res) => {
  res.json({
    maptiler: process.env.MAPTILER_API_KEY,
    weather: process.env.WEATHER_API_KEY
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});