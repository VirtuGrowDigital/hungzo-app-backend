import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    vehicleType: {
      type: String,
      enum: ["BIKE", "SCOOTY", "PICKUP"],
      default: "BIKE",
    },

    licenseNumber: String,
    vehicleNumber: String,

    verificationStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    isActive: { type: Boolean, default: false }, 
    isOnline: { type: Boolean, default: false }, 

    currentLocation: {
      lat: Number,
      lng: Number,
    },

    totalEarnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

driverSchema.index({ user: 1 });
driverSchema.index({ verificationStatus: 1 });
driverSchema.index({ isOnline: 1, isActive: 1 });


const Driver = mongoose.model("Driver", driverSchema);

export default Driver;
