const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public/
app.use(express.static(path.join(__dirname, "public")));

// Route to send API keys to frontend
app.get("/api/keys", (req, res) => {
  res.json({
    maptiler: process.env.MAPTILER_API_KEY,
    weather: process.env.WEATHER_API_KEY
  });
});

// Start server only in local dev (Vercel doesn't need this)
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

module.exports = app;