const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    vehicleType: { type: String, enum: ["BIKE", "SCOOTY", "PICKUP"], default: "BIKE" },
    licenseNumber: String,
    vehicleNumber: String,

    verificationStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    isActive: { type: Boolean, default: false }, // active = working
    isOnline: { type: Boolean, default: false }, // online = available for orders

    currentLocation: {
      lat: Number,
      lng: Number,
    },

    totalEarnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Driver", driverSchema);
