import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin", // 🔥 supplier = admin
      required: true,
    },

    name: { type: String, required: true },
    category: String,

    price: { type: Number, required: true },
    unit: { type: String, enum: ["KG", "LITER", "PACK"], required: true },

    stock: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
