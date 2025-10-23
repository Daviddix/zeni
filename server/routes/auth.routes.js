const express = require('express');
const authRouter = express.Router();
const { auth, db } = require("../config/firebase");

authRouter.post("/", async (req, res) => {
  try {
    const { idToken } = req.body;
    const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days

    // Verify the ID token
    const decoded = await auth.verifyIdToken(idToken);

    // If user doesn't exist in Firestore, create record
    const userRef = db.collection("users").doc(decoded.uid);
    const userDoc = await userRef.get();
    if (!userDoc.exists) {
      await userRef.set({
        email: decoded.email,
        createdAt: new Date().toISOString(),
        uid: decoded.uid,
      });
    }

    // Create Firebase session cookie
    const sessionCookie = await auth.createSessionCookie(idToken, { expiresIn });

    res.cookie("session", sessionCookie, {
      maxAge: expiresIn,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      path: "/",
    });

    res.status(200).json({ message: "Session created", success: true });
  } catch (err) {
    console.error("Session login error:", err);
    res.status(401).json({ message: "Unauthorized", error: err.message });
  }
});

module.exports = authRouter;