const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    label: String,
    line1: String,
    line2: String,
    city: String,
    state: String,
    pincode: String,
    location: {
      lat: Number,
      lng: Number,
    },
  },
  { _id: false }
);

const restaurantSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    name: { type: String, required: true },

    gst: String,
    fssai: String,

    docs: {
      gstDocUrl: String,
      fssaiDocUrl: String,
    },

    addresses: [addressSchema],

    verificationStatus: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    isActive: { type: Boolean, default: true }, // visible on app
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
