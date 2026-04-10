require("dotenv").config();
const express = require("express");
const client = require("./db/client");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  })
);
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/api/expenses", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM expenses;");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/expenses", async (req, res) => {
  try {
    const {title, amount, category} = req.body;

    const result = await client.query(
      `
      INSERT INTO expenses (title, amount, category)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [title, amount, category]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/expenses", async (req, res) => {
  try {
    const {title, amount, category} = req.body;

    const result = await client.query(
      `
      DELETE FROM expenses (title, amount, category)
      WHERE title = $1 AND amount = $2 AND category = $3
      RETURNING *;
      `,
      [title, amount, category]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ error: "Server error" });
  }
});

async function startServer() {
  try {
    await client.connect();
    console.log("Connected to the database.");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error connecting to the database:", error);
  }
}

startServer();
