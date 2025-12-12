import admin from "firebase-admin";

const firebaseAuthMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Missing token" });
    }

    const idToken = header.split(" ")[1];

    const decoded = await admin.auth().verifyIdToken(idToken);

    req.firebaseUser = decoded; // uid, phone, email, etc.
    next();
  } catch (err) {
    res.status(401).json({
      message: "Invalid Firebase Token",
      error: err.message,
    });
  }
};

export default firebaseAuthMiddleware;
