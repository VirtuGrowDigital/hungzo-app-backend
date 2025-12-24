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
      createdBy: req.user?._id
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


// GET MENU (PUBLIC)
export const getMenu = async (req, res) => {
  try {
    const menu = await Category.aggregate([
      { $match: { isActive: true } },
      {
        $lookup: {
          from: "products",
          let: { categoryId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$category", "$$categoryId"] },
                    { $eq: ["$isActive", true] },
                    { $eq: ["$status", "available"] }
                  ]
                }
              }
            },
            {
              $project: {
                name: 1,
                description: 1,
                images: 1,
                // basePrice: 1,
                varieties: {
                  $filter: {
                    input: "$varieties",
                    as: "v",
                    cond: { $eq: ["$$v.isAvailable", true] }
                  }
                }
              }
            },
            { $sort: { createdAt: -1 } }
          ],
          as: "products"
        }
      },
      { $match: { "products.0": { $exists: true } } },
      {
        $project: {
          _id: 1,
          category: "$name",
          products: 1
        }
      }
    ]);

    res.json({
      success: true,
      menu
    });
  } catch (error) {
    console.error("Get Menu Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};



// Get Products Grouped by Category (for users)
// CATEGORY PAGE (PUBLIC)
export const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const products = await Product.find({
      category: categoryId,
      isActive: true,
      status: "available"
    })
      .select("name description images varieties")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
