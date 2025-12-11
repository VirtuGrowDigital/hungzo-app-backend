const User = require("../models/User");

// MOCK LOGIN FOR POSTMAN 
// No Firebase required — user sends firebaseUid + phone manually

exports.mockLogin = async (req, res) => {
  try {
    const { firebaseUid, phone, role } = req.body;

    if (!firebaseUid || !phone || !role) {
      return res.status(400).json({ message: "firebaseUid, phone, role required" });
    }

    let user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.json({
        status: "NEW_USER",
        firebaseUid,
        phone,
        role
      });
    }

    // Existing user
    return res.json({
      status: "EXISTING_USER",
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
