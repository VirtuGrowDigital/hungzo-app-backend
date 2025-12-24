import admin from "../config/firebase.js";

const firebaseAuthMiddleware = async (req, res, next) => {
  try {
    // MOCK MODE (Postman)
    if (process.env.MOCK_FIREBASE === "true") {
      req.firebaseUser = {
        uid: req.body.firebaseUid || "mock_firebase_uid_123",
        phone_number: req.body.phone || "9999999999",
        name: req.body.name || "Mock User",

      };
      return next();
    }

    // REAL FIREBASE MODE
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing Firebase token" });
    }

    const idToken = header.split(" ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    req.firebaseUser = decoded;
    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid Firebase Token",
      error: err.message,
    });
  }
};

export default firebaseAuthMiddleware;
