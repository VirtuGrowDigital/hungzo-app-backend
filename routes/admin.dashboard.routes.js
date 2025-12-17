import express from "express";
import {
  verifiedRestaurants,
  verifiedDrivers,
  getRejectedRestaurants,
  getRejectedDrivers,
  getPendingRestaurants,
  getPendingDrivers,
} from "../controllers/admin.dashboard.controller.js";
import { protect, requireRole } from "../middlewares/jwtAuth.js";


const router = express.Router();

router.use(protect);
router.use(requireRole("ADMIN", "SUPERADMIN"));
// router.use(requireRole("ADMIN"));

router.get("/restaurants/verified", verifiedRestaurants);
router.get("/drivers/verified", verifiedDrivers);

router.get("/restaurants/rejected", getRejectedRestaurants);
router.get("/drivers/rejected", getRejectedDrivers);

router.get("/restaurants/pending", getPendingRestaurants);
router.get("/drivers/pending", getPendingDrivers);

export default router;
