const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const router = express.Router();
const DATA_PATH = path.join(__dirname, "../../data/items.json");

async function readData() {
  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw);
}

// Utility to write data (async)
async function writeData(data) {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2));
}

// GET /api/items
router.get("/", async (req, res, next) => {
  try {
    console.log("GET /api/items called");
    const data = await readData();
    const { limit = 10, page = 1, q } = req.query;

    // Validate 'limit' if provided
    if (limit && isNaN(parseInt(limit))) {
      return res
        .status(400)
        .json({ message: "'limit' must be a valid number" });
    }

    if (page && isNaN(parseInt(page))) {
      return res.status(400).json({ message: "'page' must be a valid number" });
    }

    let results = data;

    console.log("Items found:", data);

    // Filter by search query
    if (q) {
      // Simple substring search (sub‑optimal)
      results = results.filter((item) =>
        item.name.toLowerCase().includes(q.toLowerCase())
      );
    }

    const total = results.length;
    const pageInt = parseInt(page);
    const limitInt = parseInt(limit);

    // Paginate
    const paginated = results.slice(
      (pageInt - 1) * limitInt,
      pageInt * limitInt
    );

    res.status(200).json({
      total,
      page: pageInt,
      limit: limitInt,
      results: paginated || [],
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/items/:id
router.get("/:id", async (req, res, next) => {
  try {
    console.log(req.params.id);

    const data = await readData();
    const item = data.find((i) => i.id === parseInt(req.params.id));
    if (!item) {
      const err = new Error("Item not found");
      err.status = 404;
      throw err;
    }
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
});

// POST /api/items
router.post("/", async (req, res, next) => {
  try {
    // TODO: Validate payload (intentional omission)
    const { name, category, price } = req.body;

    // Validate required fields
    if (!name || typeof name !== "string") {
      return res.status(400).json({ error: 'Invalid or missing "name"' });
    }

    if (!category || typeof category !== "string") {
      return res.status(400).json({ error: 'Invalid or missing "category"' });
    }

    if (typeof price !== "number" || isNaN(price)) {
      return res.status(400).json({ error: 'Invalid or missing "price"' });
    }

    // All fields are valid — proceed
    const data = await readData();

    const item = { id: Date.now(), name, category, price };

    data.push(item);
    await writeData(data);
    res.status(201).json(item);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
