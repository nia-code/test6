const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();
const { mean } = require("../utils/stats");

const DATA_PATH = path.join(__dirname, "../../data/items.json");

let cachedStats = null;
let lastModifiedTime = null;

// Function to recalculate stats
function calculateStats(items) {
  return {
    total: items.length,
    averagePrice: mean(items.map((i) => i.price)),
  };
}

// Function to read file and update cache
function updateStatsCache() {
  fs.readFile(DATA_PATH, "utf-8", (err, raw) => {
    if (err) {
      console.error("Failed to read items.json:", err);
      cachedStats = null;
      return;
    }

    try {
      const items = JSON.parse(raw);
      cachedStats = calculateStats(items);
      console.log("Stats cache updated");
    } catch (parseErr) {
      console.error("Failed to parse items.json:", parseErr);
      cachedStats = null;
    }
  });
}

// Initial cache load
updateStatsCache();

// Watch for changes in items.json
fs.watch(DATA_PATH, (eventType) => {
  if (eventType === "change") {
    console.log("items.json changed. Updating stats cache...");
    updateStatsCache();
  }
});

// GET /api/stats
router.get("/", (req, res) => {
  if (cachedStats) {
    res.json(cachedStats);
  } else {
    res.status(500).json({ message: "Stats not available yet" });
  }
});

module.exports = router;
