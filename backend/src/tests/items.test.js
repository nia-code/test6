const request = require("supertest");
const express = require("express");
const itemsRouter = require("../routes/items"); // adjust path if needed

const app = express();
app.use(express.json());
app.use("/api/items", itemsRouter);

describe("GET /api/items", () => {
  it("should return a list of items (or empty array)", async () => {
    const res = await request(app).get("/api/items");
    console.log(res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.results.length).toBeGreaterThanOrEqual(0);
    if (res.body.results.length > 0) {
      expect(typeof res.body.results[0].name).toBe("string");
    }
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(typeof res.body.total).toBe("number");
  });

  it("should handle invalid limit query param", async () => {
    const res = await request(app).get("/api/items?limit=not-a-number");

    expect(res.statusCode).toBe(400); // Adjust this if your server doesn't throw 400 yet
    expect(res.body.message).toMatch(/must be a valid number/i);
  });
});

describe("POST /api/items", () => {
  it("should create a new item with valid data", async () => {
    const newItem = {
      name: "Test Product",
      category: "Test Category",
      price: 1234,
    };

    const res = await request(app).post("/api/items").send(newItem);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("id");
    expect(res.body.name).toBe(newItem.name);
    expect(res.body.category).toBe(newItem.category);
    expect(res.body.price).toBe(newItem.price);
  });

  it("should fail if name is missing", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({ category: "Test", price: 500 });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/name/i);
  });

  it("should fail if category is missing", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({ name: "No Category", price: 500 });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/category/i);
  });

  it("should fail if price is missing or invalid", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({ name: "No Price", category: "Test" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/price/i);
  });

  it("should fail if price is not a number", async () => {
    const res = await request(app)
      .post("/api/items")
      .send({ name: "Bad Price", category: "Test", price: "free" });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/price/i);
  });
});
