// ============================================================
// adminRoutes.js — Admin routes (protected)
// GET /api/admin/users  — List all users
// GET /api/admin/stats  — Platform statistics
// ============================================================

const express = require("express");
const router  = express.Router();
const { verifyToken, requireAdmin } = require("../middleware/authMiddleware");
const { db } = require("../services/firebaseAdmin");

// GET /api/admin/users — Fetch all users (most recent 50)
router.get("/users", verifyToken, requireAdmin, async (req, res) => {
  try {
    const snapshot = await db
      .collection("users")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || null,
    }));

    return res.json({ users, total: users.length });
  } catch (err) {
    console.error("Users fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch users." });
  }
});

// GET /api/admin/stats — Platform statistics
router.get("/stats", verifyToken, requireAdmin, async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const allUsers = snapshot.docs.map((d) => d.data());

    const totalUsers    = allUsers.length;
    const totalMissions = allUsers.reduce((sum, u) => sum + (u.missionsCompleted || 0), 0);
    const totalScore    = allUsers.reduce((sum, u) => sum + (u.totalScore || 0), 0);
    const avgScore      = totalUsers > 0 ? Math.round(totalScore / totalUsers) : 0;
    const activePlayers = allUsers.filter((u) => u.isActive).length;

    return res.json({
      totalUsers,
      totalMissions,
      avgScore,
      activePlayers,
    });
  } catch (err) {
    console.error("Stats fetch error:", err);
    return res.status(500).json({ error: "Failed to fetch platform stats." });
  }
});

module.exports = router;