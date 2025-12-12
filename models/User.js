import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String }, // For Firebase login

    name: { type: String, trim: true },

    phone: { type: String, unique: true, sparse: true }, // Admin may not have phone

    role: {
      type: String,
      enum: ["RESTAURANT", "DRIVER", "ADMIN"],
      required: true,
    },

    // OTP verification (for Restaurant & Driver only)
    isVerified: { type: Boolean, default: false },

    fcmTokens: { type: [String], default: [] },

    // Relationship Links
    restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
    driverId: { type: mongoose.Schema.Types.ObjectId, ref: "Driver" },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
