
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
app.set("trust proxy", 1);
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

// Rate limiting for account registration and login.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false
});

// Separate limits help control AI usage and unexpected API costs.
const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Too many AI requests. Please try again later."
  }
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
    console.error("Health check failed:", error.message);
    res.status(503).json({
      status: "error",
      message: "Database unavailable"
    });
  }
});

// ==============================
// STUDENT REGISTRATION
// ==============================

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

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 255
    ) {
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

// ==============================
// STUDENT LOGIN
// ==============================

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
       FROM students
       WHERE email = $1`,
      [email]
    );

    const student = result.rows[0];

    if (
      !student ||
      !(await bcrypt.compare(password, student.password_hash))
    ) {
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
      {
        expiresIn: "2h",
        issuer: "campusgenius-api"
      }
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

// ==============================
// CAMPUSGENIUS AI TUTOR
// ==============================

app.post("/api/ai-tutor", aiLimiter, async (req, res) => {
  try {
    // 1. Verify the student's login token.
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Please log in to use the AI Tutor."
      });
    }

    const token = authHeader.slice(7);

    let student;

    try {
      student = jwt.verify(token, process.env.JWT_SECRET, {
        issuer: "campusgenius-api"
      });
    } catch {
      return res.status(401).json({
        error: "Your session has expired. Please log in again."
      });
    }

    if (!student.sub) {
      return res.status(401).json({
        error: "Invalid student session. Please log in again."
      });
    }

    // 2. Validate the question and tutor settings.
    const question = String(req.body.question || "").trim();
    const subject = String(req.body.subject || "General").trim().slice(0, 100);
    const level = String(req.body.level || "Undergraduate").trim().slice(0, 100);
    const mode = String(req.body.mode || "Explain").trim().slice(0, 50);

    if (!question) {
      return res.status(400).json({
        error: "Please enter a question."
      });
    }

    if (question.length > 4000) {
      return res.status(400).json({
        error: "Your question must not exceed 4,000 characters."
      });
    }

    // 3. Read private API credentials from the server environment.
    const apiKey = process.env.OPENAI_API_KEY;
    const model = process.env.OPENAI_MODEL || "gpt-5.5";

    if (!apiKey) {
      return res.status(503).json({
        error: "The AI Tutor has not been configured yet."
      });
    }

    // 4. Define the tutor's teaching instructions.
    const instructions = `
You are CampusGenius AI Tutor, an educational assistant.

Subject: ${subject}
Student's study level: ${level}
Learning mode: ${mode}

Help students learn accurately and confidently.
Use clear, step-by-step explanations suitable for their level.
Use examples and calculations where helpful.
For practice questions, explain why the answer is correct.
For revision, organise important concepts clearly.
Never invent official exam answers, references, or school policies.
State uncertainty when necessary.
Encourage understanding rather than academic dishonesty.
`;

    // 5. Send the question to the OpenAI Responses API.
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);

    let apiResponse;

    try {
      apiResponse = await fetch(
        "https://api.openai.com/v1/responses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model,
            instructions,
            input: question,
            max_output_tokens: 1200
          }),
          signal: controller.signal
        }
      );
    } finally {
      clearTimeout(timeout);
    }

    if (!apiResponse.ok) {
      const status = apiResponse.status;

      // Log status only. Do not expose credentials or raw provider errors.
      console.error("AI provider request failed. HTTP status:", status);

      if (status === 401 || status === 403) {
        return res.status(502).json({
          error: "The AI service credentials need to be checked."
        });
      }

      if (status === 429) {
        return res.status(503).json({
          error: "The AI service is busy or its usage limit has been reached. Please try again later."
        });
      }

      return res.status(502).json({
        error: "The AI Tutor could not answer right now. Please try again."
      });
    }

    const data = await apiResponse.json();

    // Extract text from the Responses API output structure.
    const answer = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text || "")
      .join("\n")
      .trim();

    if (!answer) {
      console.error("AI provider returned no output text.");

      return res.status(502).json({
        error: "The AI Tutor returned no answer. Please try again."
      });
    }

    // 6. Return the answer to the logged-in student.
    return res.json({ answer });
  } catch (error) {
    if (error.name === "AbortError") {
      return res.status(504).json({
        error: "The AI Tutor took too long to respond. Please try again."
      });
    }

    console.error("AI Tutor request failed:", error.message);

    return res.status(500).json({
      error: "Something went wrong. Please try again later."
    });
  }
});

// ==============================
// START SERVER
// ==============================

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
