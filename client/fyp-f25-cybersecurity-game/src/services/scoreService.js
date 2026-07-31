// ============================================================
// src/services/scoreService.js
// Handles saving mission scores to Firebase Firestore
// ============================================================

import { doc, updateDoc, increment, getDoc } from "firebase/firestore";
import { db } from "./firebase";

// ─── Calculate level based on total score ────────────────────
export const calculateLevel = (totalScore) => {
  if (totalScore >= 5000) return 10;
  if (totalScore >= 4000) return 9;
  if (totalScore >= 3000) return 8;
  if (totalScore >= 2500) return 7;
  if (totalScore >= 2000) return 6;
  if (totalScore >= 1500) return 5;
  if (totalScore >= 1000) return 4;
  if (totalScore >= 700)  return 3;
  if (totalScore >= 400)  return 2;
  return 1;
};

// ─── Save mission score to Firestore ─────────────────────────
export const saveMissionScore = async (uid, missionScore) => {
  try {
    const userRef = doc(db, "users", uid);

    // Get current user data
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      console.error("User document not found");
      return { success: false };
    }

    const currentData  = userSnap.data();
    const newTotalScore = (currentData.totalScore || 0) + missionScore;
    const newLevel      = calculateLevel(newTotalScore);

    // Update Firestore
    await updateDoc(userRef, {
      totalScore:        increment(missionScore),
      missionsCompleted: increment(1),
      level:             newLevel,
    });

    return {
      success:       true,
      newTotalScore,
      newLevel,
      pointsEarned:  missionScore,
      leveledUp:     newLevel > (currentData.level || 1),
    };
  } catch (err) {
    console.error("Score save error:", err);
    return { success: false, error: err.message };
  }
};