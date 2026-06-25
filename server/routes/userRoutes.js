// ============================================================
// userRoutes.js — Player ke liye routes
// GET /api/users/me — apna profile dekho
// ============================================================

const express = require("express");
const router  = express.Router();
const { verifyToken } = require("../middleware/authMiddleware");
const { db }          = require("../services/firebaseAdmin");

// GET /api/users/me — Apna profile fetch karo
router.get("/me", verifyToken, async (req, res) => {
  try {
    const docRef  = db.collection("users").doc(req.user.uid);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "User document nahi mila." });
    }

    return res.json({ user: docSnap.data() });
  } catch (err) {
    console.error("Profile fetch error:", err);
    return res.status(500).json({ error: "Server error. Dobara try karo." });
  }
});

module.exports = router;