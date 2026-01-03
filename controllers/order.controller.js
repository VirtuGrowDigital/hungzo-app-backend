import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import User from "../models/User.js";
import { sendOrderPlacedMail, sendOrderStatusMail } from "../utils/orderMail.js";
import razorpay from "../utils/razorpay.js";
import crypto from "crypto";

/* =========================
   USER – PLACE ORDER
========================= */


// export const placeOrder = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { shippingAddress, paymentMethod } = req.body;

//     if (!shippingAddress) {
//       return res.status(400).json({ message: "Shipping address required" });
//     }

//     // FETCH USER DATA
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const cart = await Cart.findOne({ user: userId }).populate("items.product");
//     if (!cart || cart.items.length === 0) {
//       return res.status(400).json({ message: "Cart is empty" });
//     }

//     let subTotal = 0;

//     const orderItems = cart.items.map((item) => {
//       const variety = item.product.varieties.id(item.varietyId);
//       const price = variety.price;
//       const total = price * item.quantity;

//       subTotal += total;

//       return {
//         product: item.product._id,
//         supplier: item.product.createdBy,
//         productName: item.product.name,
//         varietyName: variety.name,
//         quantity: item.quantity,
//         price,
//         total,
//       };
//     });

//     const deliveryCharge = subTotal < 200 ? 50 : 0;
//     const gstAmount = 0;
//     const totalAmount = subTotal + deliveryCharge + gstAmount;

//     // CREATE ORDER WITH FULL USER DETAILS
//     const order = await Order.create({
//       user: userId,
//       userDetails: {
//         name: user.name || "",
//         email: user.email || "",
//         phone: user.phone || "",
//         address: shippingAddress,
//       },
//       items: orderItems,
//       subTotal,
//       deliveryCharge,
//       gstAmount,
//       totalAmount,
//       paymentMethod,
//       shippingAddress,
//     });

//     await Cart.findOneAndDelete({ user: userId });

//     // SEND EMAIL SAFELY
//     if (user.email) {
//       await sendOrderPlacedMail(user.email, order);
//     }

//     res.status(201).json({
//       success: true,
//       message: "Order placed successfully",
//       order,
//     });
//   } catch (error) {
//     console.error("Place Order Error:", error);
//     res.status(500).json({ message: "Server Error" });
//   }
// };


/* =========================
   PLACE ORDER (COD + ONLINE)
========================= */
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: "Shipping address required" });
    }

    if (!["COD", "ONLINE"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

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

    /* ======================
       ONLINE PAYMENT FLOW
    ===================== */
    if (paymentMethod === "ONLINE") {
      const razorpayOrder = await razorpay.orders.create({
        amount: totalAmount * 100, // paise
        currency: "INR",
        receipt: `rcpt_${Date.now()}`,
      });

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
        paymentMethod: "ONLINE",
        paymentStatus: "pending",
        orderStatus: "Pending",
        shippingAddress,
        razorpayOrderId: razorpayOrder.id,
      });

      return res.json({
        success: true,
        type: "ONLINE",
        orderId: order._id,
        razorpayOrderId: razorpayOrder.id,
        amount: totalAmount,
        key: process.env.RAZORPAY_KEY_ID,
      });
    }

    /* ======================
       COD FLOW
    ===================== */
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
      paymentMethod: "COD",
      paymentStatus: "pending",
      orderStatus: "Pending",
      shippingAddress,
    });

    await Cart.findOneAndDelete({ user: userId });

    if (user.email) {
      await sendOrderPlacedMail(user.email, order);
    }

    res.status(201).json({
      success: true,
      type: "COD",
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Place Order Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

 /* ======================
// verify online payment
   ===================== */
export const verifyOnlinePayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = "paid";
    order.orderStatus = "Accepted";
    order.razorpayPaymentId = razorpay_payment_id;

    await order.save();

    await Cart.findOneAndDelete({ user: order.user });

    if (order.userDetails.email) {
      await sendOrderPlacedMail(order.userDetails.email, order);
    }

    res.json({ success: true, message: "Payment verified successfully" });
  } catch (error) {
    console.error("Verify Payment Error:", error);
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
  const orderId = req.params.id;
  const { orderStatus } = req.body;

  const allowed = [
    "Pending",
    "Accepted",
    "Preparing",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  if (!allowed.includes(orderStatus)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: "Order not found" });

  order.orderStatus = orderStatus;
  await order.save();

  if (order.userDetails.email) {
    await sendOrderStatusMail(order.userDetails.email, order);
  }

  res.json({ success: true, message: "Order status updated", order });
};

