// ============================================================
// userRoutes.js — Player routes
// GET /api/users/me — fetch own profile
// ============================================================

const express = require("express");
const router  = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { db }          = require("../services/firebaseAdmin");

// GET /api/users/me — Fetch logged-in player's profile
router.get("/me", verifyToken, async (req, res) => {
  try {
    const docRef  = db.collection("users").doc(req.user.uid);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "User document not found." });
    }
    return res.json({ user: docSnap.data() });
  } catch (err) {
    console.error("Profile fetch error:", err);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
});

module.exports = router;