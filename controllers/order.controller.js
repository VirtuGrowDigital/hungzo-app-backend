import Order from "../models/Order.js";

export const myOrders = async (req, res) => {
  const filter =
    req.user.role === "SUPERADMIN"
      ? {}
      : { admin: req.user.id };

  const orders = await Order.find(filter)
    .populate("restaurant")
    .populate("items.product");

  res.json(orders);
};
