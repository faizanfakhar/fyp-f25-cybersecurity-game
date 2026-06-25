// ============================================================
// index.js — Express Server ka entry point
// Port: .env mein PORT variable set karo (default: 5000)
// ============================================================

require("dotenv").config();

const express    = require("express");
const cors       = require("cors");
const userRoutes  = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173", // Vite ka default port
  credentials: true,
}));
app.use(express.json());

// ─── Routes ─────────────────────────────────────────────────
app.use("/api/users",  userRoutes);
app.use("/api/admin",  adminRoutes);

// ─── Health check ────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "Server chal raha hai ✅", timestamp: new Date().toISOString() });
});

// ─── 404 handler ─────────────────────────────────────────────
app.use("*", (req, res) => {
  res.status(404).json({ error: "Yeh route exist nahi karta." });
});

// ─── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server chal raha hai: http://localhost:${PORT}`);
});