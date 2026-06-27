// ============================================================
// firebaseAdmin.js — Firebase Admin SDK setup (v14)
// ============================================================

const { initializeApp, getApps, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { getAuth } = require("firebase-admin/auth");

if (!getApps().length) {
  // Fix private key format — handles both escaped and unescaped newlines
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n").replace(/\n/g, "\n")
    : undefined;

  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey,
    }),
  });
}

const db   = getFirestore();
const auth = getAuth();

module.exports = { auth, db };