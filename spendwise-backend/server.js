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

function parsePayDate(value) {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsedValue = Number(value);

  if (!Number.isInteger(parsedValue) || parsedValue < 1 || parsedValue > 31) {
    return NaN;
  }

  return parsedValue;
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "";
}

function parseAmount(value) {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue) || parsedValue <= 0) {
    return NaN;
  }

  return parsedValue;
}


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
    const { title, amount, category } = req.body;
    const parsedAmount = parseAmount(amount);

    if (!isNonEmptyString(title)) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!isNonEmptyString(category)) {
      return res.status(400).json({ error: "Category is required" });
    }

    if (Number.isNaN(parsedAmount)) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }

    const result = await client.query(
      `
      INSERT INTO expenses (title, amount, category)
      VALUES ($1, $2, $3)
      RETURNING *;
      `,
      [title.trim(), parsedAmount, category.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await client.query(
      `
      DELETE FROM expenses
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Expense not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error deleting expense:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/income-sources", async (req, res) => {
  try {
    const result = await client.query("SELECT * FROM income_sources;");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching income sources:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/income-sources", async (req, res) => {
  try {
    const { source_name, amount, frequency, pay_date_1, pay_date_2 } = req.body;
    const parsedAmount = parseAmount(amount);
    const parsedPayDate1 = parsePayDate(pay_date_1);
    const parsedPayDate2 = parsePayDate(pay_date_2);

    if (!isNonEmptyString(source_name)) {
      return res.status(400).json({ error: "Source name is required" });
    }

    if (Number.isNaN(parsedAmount)) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }
    
    if (parsedPayDate1 === null || Number.isNaN(parsedPayDate1)) {
      return res.status(400).json({
        error: "pay_date_1 must be an integer between 1 and 31",
      });
    }

    if (Number.isNaN(parsedPayDate2)) {
      return res.status(400).json({
        error: "pay_date_2 must be an integer between 1 and 31 or be empty",
      });
    }

    const result = await client.query(
      `
      INSERT INTO income_sources (source_name, amount, frequency, pay_date_1, pay_date_2)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
      `,
      [source_name.trim(), parsedAmount, frequency.trim(), parsedPayDate1, parsedPayDate2]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating income source:", error);
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

app.delete("/api/income-sources/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await client.query(
      `
      DELETE FROM income_sources
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: "Income source not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error deleting income source:", error);
    res.status(500).json({ error: "Server error" });
  }
});

startServer();
