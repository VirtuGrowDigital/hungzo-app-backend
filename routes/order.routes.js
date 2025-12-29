import express from "express";
import {
  placeOrder,
  myOrders,
  getAdminOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/order.controller.js";
import { protect, requireRole } from "../middlewares/jwtAuth.js";

const router = express.Router();

/* USER */
router.post("/place", protect, placeOrder);
router.get("/my", protect, myOrders);

/* ADMIN */
router.get(
  "/admin",
  protect,
  requireRole("ADMIN"),
  getAdminOrders
);

/* SUPERADMIN */
router.get(
  "/all",
  protect,
  requireRole("SUPERADMIN"),
  getAllOrders
);

/* ADMIN + SUPERADMIN */
router.put(
  "/status/:id",
  protect,
  requireRole("ADMIN", "SUPERADMIN"),
  updateOrderStatus
);

export default router;
