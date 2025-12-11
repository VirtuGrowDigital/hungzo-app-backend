const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String },   // IMPORTANT for Firebase login

    name: { type: String, trim: true },
    phone: { type: String, unique: true, sparse: true }, // admin can have no phone

    role: {
      type: String,
      enum: ['RESTAURANT', 'DRIVER', 'ADMIN'],
      required: true,
    },

    // OTP verification (for Restaurant & Driver only)
    isVerified: { type: Boolean, default: false },

    fcmTokens: { type: [String], default: [] },

    // Relationship Links
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
