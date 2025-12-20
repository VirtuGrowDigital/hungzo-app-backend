import Product from "../models/Product.js";


// Admin controllers

// Create Product (Multiple Images)
export const createProduct = async (req, res) => {
  try {
    const { name, description, category, stock, status, varieties } = req.body;

    // if (!name || !category)
    //   return res.status(400).json({ message: "Name and Category are required" });

    const parsedVarieties = varieties ? varieties : [];

    // ✅ S3 uploaded image URLs
    const imageUrls = req.files ? req.files.map((file) => file.location) : [];

    const product = await Product.create({
      name,
      description,
      category,
      stock,
      status,
      varieties: parsedVarieties,
      images: imageUrls,
      createdBy: req.user?.id || null,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error("Create Product Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// MY PRODUCTS (ADMIN)
export const myProducts = async (req, res) => {
  try {
    const filter =
      req.user.role === "SUPERADMIN"
        ? {}
        : { admin: req.user.id };

    const products = await Product.find(filter)
      .populate("createdBy", "username role")
      .sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error("Get Product Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const query =
      req.user.role === "SUPERADMIN"
        ? { _id: id }
        : { _id: id, createdBy: req.user.id };

    const product = await Product.findOne(query);
    if (!product) {
      return res.status(403).json({ message: "Access denied or product not found" });
    }

    if (req.files && req.files.length > 0) {
      product.images = req.files.map((file) => file.location);
    }

    product.name = req.body.name ?? product.name;
    product.description = req.body.description ?? product.description;
    product.category = req.body.category ?? product.category;
    product.stock = req.body.stock ?? product.stock;
    product.status = req.body.status ?? product.status;
    product.varieties = req.body.varieties ?? product.varieties;
    product.isActive = req.body.isActive ?? product.isActive;

    const updated = await product.save();

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updated,
    });
  } catch (error) {
    console.error("Update Product Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};


// DELETE PRODUCT

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const query =
      req.user.role === "SUPERADMIN"
        ? { _id: id }
        : { _id: id, admin: req.user.id };

    const product = await Product.findOne(query);
    if (!product) {
      return res.status(403).json({ message: "Access denied or product not found" });
    }

    // const s3 = new AWS.S3();

    // for (const imageUrl of product.images) {
    //   if (!imageUrl) continue;

    //   const key = imageUrl.split(".amazonaws.com/")[1];
    //   if (!key) continue;

    //   await s3
    //     .deleteObject({
    //       Bucket: process.env.AWS_BUCKET_NAME,
    //       Key: key,
    //     })
    //     .promise();
    // }

    await product.deleteOne();

    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    console.error("Delete Product Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};



// Get Active Products (Public)
export const getActiveProducts = async (req, res) => {
  try {
    const products = await Product.find({
      isActive: true,
      status: "available",
    }).sort({ createdAt: -1 });

    res.json({ success: true, products });
  } catch (error) {
    console.error("Get Active Products Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};

// Get Single Product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive)
      return res.status(404).json({ message: "Product not found or inactive" });

    res.json({ success: true, product });
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    res.status(500).json({ success: false, message: "Server Error", error });
  }
};