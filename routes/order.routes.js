import express from "express";
import { myOrders } from "../controllers/order.controller.js";
import { protect, requireRole } from "../middlewares/jwtAuth.js";

const router = express.Router();

router.use(protect);
router.use(requireRole("ADMIN", "SUPERADMIN"));

router.get("/my", myOrders);

export default router;
