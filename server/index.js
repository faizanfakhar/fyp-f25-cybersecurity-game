// ============================================================
// index.js — Express server entry point
// FYP-F25 Cybersecurity Game — Backend API
// ============================================================
 
require("dotenv").config();
const express     = require("express");
const cors        = require("cors");
const userRoutes  = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
 
const app  = express();
const PORT = process.env.PORT || 5000;
 
// ─── Middleware ──────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
 
// ─── Routes ─────────────────────────────────────────────────
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
 
// ─── Health check ────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running ✅", timestamp: new Date().toISOString() });
});
 
// ─── 404 handler (Express v5 compatible) ─────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found." });
});
 
// ─── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Server running at: http://localhost:${PORT}`);
});