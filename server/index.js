
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  console.error("DATABASE_URL and JWT_SECRET must be configured.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10kb" }));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false
});

app.get("/", (req, res) => {
  res.json({
    message: "CampusGenius API is running",
    status: "online"
  });
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    res.status(503).json({
      status: "error",
      message: "Database unavailable"
    });
  }
});

app.post("/api/auth/register", authLimiter, async (req, res) => {
  try {
    const fullName = String(req.body.fullName || "").trim();
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (fullName.length < 2 || fullName.length > 120) {
      return res.status(400).json({
        message: "Enter a name between 2 and 120 characters."
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        email.length > 255) {
      return res.status(400).json({
        message: "Enter a valid email address."
      });
    }

    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        message: "Password must contain 8 to 72 characters."
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO students (full_name, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, full_name, email, role, created_at`,
      [fullName, email, passwordHash]
    );

    return res.status(201).json({
      message: "Account created successfully.",
      student: result.rows[0]
    });
  } catch (error) {
    if (error.code === "23505") {
      return res.status(409).json({
        message: "An account with this email already exists."
      });
    }

    console.error("Registration failed:", error.message);
    return res.status(500).json({
      message: "Registration failed. Please try again later."
    });
  }
});

app.post("/api/auth/login", authLimiter, async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        message: "Enter your email and password."
      });
    }

    const result = await pool.query(
      `SELECT id, full_name, email, password_hash, role
       FROM students WHERE email = $1`,
      [email]
    );

    const student = result.rows[0];

    if (!student || !(await bcrypt.compare(password, student.password_hash))) {
      return res.status(401).json({
        message: "Invalid email or password."
      });
    }

    const token = jwt.sign(
      {
        sub: String(student.id),
        role: student.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h", issuer: "campusgenius-api" }
    );

    return res.json({
      message: "Login successful.",
      token,
      student: {
        id: student.id,
        full_name: student.full_name,
        email: student.email,
        role: student.role
      }
    });
  } catch (error) {
    console.error("Login failed:", error.message);
    return res.status(500).json({
      message: "Login failed. Please try again later."
    });
  }
});

async function startServer() {
  try {
    const schema = fs.readFileSync(
      path.join(__dirname, "schema.sql"),
      "utf8"
    );

    await pool.query(schema);

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`CampusGenius API listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
}

startServer();
