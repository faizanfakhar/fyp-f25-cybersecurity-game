// ============================================================
// authMiddleware.js — Firebase token verification middleware
// ============================================================
 
const { auth, db } = require("../services/firebaseAdmin");
 
// Verify Firebase ID token from Authorization header
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided." });
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    req.user = await auth.verifyIdToken(token);
    next();
  } catch {
    return res.status(401).json({ error: "Token is invalid or expired." });
  }
};
 
// Check if authenticated user has admin role in Firestore
const requireAdmin = async (req, res, next) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }
    next();
  } catch {
    return res.status(500).json({ error: "Failed to verify admin role." });
  }
};
 
module.exports = { verifyToken, requireAdmin };