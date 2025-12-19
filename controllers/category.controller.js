import Category from "../models/Category.js";
import Product from "../models/Product.js";

// Create Category
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Category name required" });

    const exists = await Category.findOne({ name: name.trim().toUpperCase() });
    if (exists)
      return res.status(400).json({ message: "Category already exists" });

    const category = await Category.create({
      name: name.trim().toUpperCase(),
      createdBy: req.admin?._id
    });

    res.status(201).json({ success: true, message: "Category created", category });
  } catch (error) {
    console.error("Create Category Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Get All Categories (Admin)
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.json({ success: true, categories });
  } catch (error) {
    console.error("Get Categories Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });

    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Delete Category Error:", error);
    res.status(500).json({ success: false, message: "Server error", error });
  }
};



// Get Products Grouped by Category (for users)
export const getProductsByCategory = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    const menu = [];

    for (const cat of categories) {
      const items = await Product.find({
        category: cat._id,
        isActive: true,
        status: "available",
      }).select("name description varieties images basePrice");

      menu.push({
        category: cat.name,
        items,
      });
    }

    res.json({ success: true, menu });
  } catch (error) {
    console.error("Get Products By Category Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};