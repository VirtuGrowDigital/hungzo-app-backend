import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, unique: true }, // For Firebase login

    name: { type: String, trim: true },

    phone: { type: String, unique: true, sparse: true }, // Admin may not have phone

    email: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,   // allows multiple users with null email
    },

    role: {
      type: String,
      enum: ["SUPERADMIN", "ADMIN", "RESTAURANT", "DRIVER"],
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

// Indexes
userSchema.index({ firebaseUid: 1 });
userSchema.index({ phone: 1 });
userSchema.index({ role: 1, isVerified: 1 });


const User = mongoose.model("User", userSchema);

export default User;
