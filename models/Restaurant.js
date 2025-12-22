import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, required: true },
    line1: String,
    line2: String,
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
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
    ownerName: {
      type: String,
      required: true,
      trim: true,
    },
    profilePic: { type: String },

    name: { type: String, required: true },

    gst: { type: String },
    fssai: { type: String },

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

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

restaurantSchema.index({ user: 1 });
restaurantSchema.index({ verificationStatus: 1 });
restaurantSchema.index({ isActive: 1 });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
