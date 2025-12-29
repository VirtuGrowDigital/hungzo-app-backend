import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import { sendOrderPlacedMail, sendOrderStatusMail } from "../utils/orderMail.js";

/* =========================
   USER – PLACE ORDER
========================= */


export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address required" });
    }

    // FETCH USER DATA
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    let subTotal = 0;

    const orderItems = cart.items.map((item) => {
      const variety = item.product.varieties.id(item.varietyId);
      const price = variety.price;
      const total = price * item.quantity;

      subTotal += total;

      return {
        product: item.product._id,
        supplier: item.product.createdBy,
        productName: item.product.name,
        varietyName: variety.name,
        quantity: item.quantity,
        price,
        total,
      };
    });

    const deliveryCharge = subTotal < 200 ? 50 : 0;
    const gstAmount = 0;
    const totalAmount = subTotal + deliveryCharge + gstAmount;

    // CREATE ORDER WITH FULL USER DETAILS
    const order = await Order.create({
      user: userId,
      userDetails: {
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: shippingAddress,
      },
      items: orderItems,
      subTotal,
      deliveryCharge,
      gstAmount,
      totalAmount,
      paymentMethod,
      shippingAddress,
    });

    await Cart.findOneAndDelete({ user: userId });

    // SEND EMAIL SAFELY
    if (user.email) {
      await sendOrderPlacedMail(user.email, order);
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


/* =========================
   USER – MY ORDERS
========================= */
export const myOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.json({ success: true, orders });
};

/* =========================
   ADMIN – THEIR ORDERS
========================= */
export const getAdminOrders = async (req, res) => {
  const adminId = req.user.id;

  const orders = await Order.find({
    "items.supplier": adminId,
  }).sort({ createdAt: -1 });

  res.json({ success: true, orders });
};

/* =========================
   SUPERADMIN – ALL ORDERS
========================= */
export const getAllOrders = async (req, res) => {
  const orders = await Order.find()
    .populate("user", "name email")
    .sort({ createdAt: -1 });

  res.json({ success: true, orders });
};

/* =========================
   ADMIN / SUPERADMIN – UPDATE STATUS
========================= */
export const updateOrderStatus = async (req, res) => {
  const  orderId  = req.params.id;
  const { orderStatus } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.orderStatus = orderStatus;
  await order.save();

  if (order.userDetails.email) {
    await sendOrderStatusMail(order.userDetails.email, order);
  }

  res.json({ success: true, message: "Order status updated", order });
};

