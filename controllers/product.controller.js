import Product from "../models/Product.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  const product = await Product.create({
    admin: req.user.id, // 🔥 admin owns product
    ...req.body,
  });

  res.json(product);
};

// MY PRODUCTS (ADMIN)
export const myProducts = async (req, res) => {
  const filter =
    req.user.role === "SUPERADMIN"
      ? {}
      : { admin: req.user.id };

  const products = await Product.find(filter);
  res.json(products);
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  const filter =
    req.user.role === "SUPERADMIN"
      ? { _id: req.params.id }
      : { _id: req.params.id, admin: req.user.id };

  const product = await Product.findOneAndUpdate(filter, req.body, {
    new: true,
  });

  res.json(product);
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  const filter =
    req.user.role === "SUPERADMIN"
      ? { _id: req.params.id }
      : { _id: req.params.id, admin: req.user.id };

  await Product.deleteOne(filter);

  res.json({ message: "Product deleted" });
};
