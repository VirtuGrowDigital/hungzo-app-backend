import User from "../models/User.js";
import admin from "../config/firebase.js";

export const firebaseLogin = async (req, res) => {
  try {
    const { idToken, role } = req.body;

    // 1. Verify token
    const decoded = await admin.auth().verifyIdToken(idToken);

    const firebaseUid = decoded.uid;
    const phone = decoded.phone_number;

    // 2. Check if user exists
    let user = await User.findOne({ firebaseUid });

    if (!user) {
      // New user → requires registration
      return res.json({
        status: "NEW_USER",
        firebaseUid,
        phone,
        role
      });
    }

    // 3. Existing user → return info
    return res.json({
      status: "EXISTING_USER",
      user
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
