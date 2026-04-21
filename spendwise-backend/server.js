require("dotenv").config();
const express = require("express");
const client = require("./db/client");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const connectPgSimple = require("connect-pg-simple");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

const PgSession = connectPgSimple(session);

app.use(
  session({
    store: new PgSession({
      pool: client,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "dev-session-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

app.get("/api/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!isNonEmptyString(username)) {
      return res.status(400).json({ error: "Username is required" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Valid email is required" });
    }
    if (!isNonEmptyString(password) || password.length < 8) {
      return res.status(400).json({ error: "Password must be at least 8 characters" });
    }

    const existingUser = await client.query(
      `
      SELECT id
      FROM users
      WHERE username = $1 OR email = $2;
      `,
      [username.trim(), email.trim().toLowerCase()]
    );
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: "Username or email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    const result = await client.query(
      `
      INSERT INTO users (username, email, password_hash)
      VALUES ($1, $2, $3)
      RETURNING id, username, email, created_at;
      `,
      [username.trim(), email.trim().toLowerCase(), passwordHash]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Valid email is required" });
    }

    if (!isNonEmptyString(password)) {
      return res.status(400).json({ error: "Password is required" });
    }

    const result = await client.query(
      `
      SELECT id, username, email, password_hash, created_at
      FROM users
      WHERE email = $1;
      `,
      [email.trim().toLowerCase()]
    );

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);

    if (!passwordMatches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/api/auth/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  res.json(req.session.user);
});

app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Error logging out user:", error);
      return res.status(500).json({ error: "Server error" });
    }
    
    res.clearCookie("connect.sid");
    res.json({ success: true });
  });
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

function isValidEmail(value) {
  return typeof value === "string" && value.includes("@");
}

function requireAuth(req, res, next) {
  if (!req.session.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }
  next();
}

app.get("/api/expenses", requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    
    const result = await client.query(
      `SELECT * FROM expenses WHERE user_id = $1 ORDER BY created_at DESC;
      `, 
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/expenses", requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
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
      INSERT INTO expenses (user_id, title, amount, category)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
      `,
      [userId, title.trim(), parsedAmount, category.trim()]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating expense:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.delete("/api/expenses/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { id } = req.params;

    const result = await client.query(
      `
      DELETE FROM expenses
      WHERE id = $1 AND user_id = $2
      RETURNING *;
      `,
      [id, userId]
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

app.get("/api/income-sources", requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const result = await client.query(

      `SELECT * FROM income_sources WHERE user_id = $1 ORDER BY created_at DESC;`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching income sources:", error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/api/income-sources", requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
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
      INSERT INTO income_sources (user_id, source_name, amount, frequency, pay_date_1, pay_date_2)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
      `,
      [userId, source_name.trim(), parsedAmount, frequency.trim(), parsedPayDate1, parsedPayDate2]
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

app.delete("/api/income-sources/:id", requireAuth, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const { id } = req.params;

    const result = await client.query(
      `
      DELETE FROM income_sources
      WHERE id = $1 AND user_id = $2
      RETURNING *;
      `,
      [id, userId]
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
