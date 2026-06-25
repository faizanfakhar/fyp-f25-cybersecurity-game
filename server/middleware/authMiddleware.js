const { admin, db } = require("../services/firebaseAdmin");

const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token nahi mila." });
  }
  const token = authHeader.split("Bearer ")[1];
  try {
    req.user = await admin.auth().verifyIdToken(token);
    next();
  } catch {
    return res.status(401).json({ error: "Token invalid ya expire ho gaya." });
  }
};

const requireAdmin = async (req, res, next) => {
  try {
    const userDoc = await db.collection("users").doc(req.user.uid).get();
    if (!userDoc.exists || userDoc.data().role !== "admin") {
      return res.status(403).json({ error: "Sirf admins yeh kar sakte hain." });
    }
    next();
  } catch {
    return res.status(500).json({ error: "Role check karne mein masla hua." });
  }
};

module.exports = { verifyToken, requireAdmin };