import mongoose from "mongoose";

const varietySchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., Single, Double, Cheese
  price: { type: Number, required: true },
  isAvailable: { type: Boolean, default: true },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    // price: {
    //   type: Number,
    //   required: true
    // },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    images: [{
      type: String
    }], 
    stock: {
      type: String,
      default: " "
    },
    status: {
      type: String,
      enum: ["available", "not available"],
      default: "available"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin"
    },
    varieties: [varietySchema],
  },
  { timestamps: true }
);

productSchema.index({ category: 1, isActive: 1, status: 1 });
productSchema.index({ createdBy: 1 });


export default mongoose.model("Product", productSchema);
