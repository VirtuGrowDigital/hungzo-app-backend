import express from "express";
import {
  createAdmin,
  listAdmins,
  deleteAdmin,
} from "../controllers/admin.controller.js";

import {
  approveRestaurant,
  rejectRestaurant,
} from "../controllers/restaurant.controller.js";

import {
  approveDriver,
  rejectDriver,
} from "../controllers/driver.controller.js";

import { protect, requireRole } from "../middlewares/jwtAuth.js";

const router = express.Router();

// Only authenticated ADMIN or SUPERADMIN
router.use(protect);
router.use(requireRole("SUPERADMIN"));

// ADMIN CRUD
router.post("/create", createAdmin);
router.get("/list", listAdmins);
router.delete("/delete/:id", deleteAdmin);

// RESTAURANT APPROVAL
router.post("/restaurants/approve/:id", approveRestaurant);
router.post("/restaurants/reject/:id", rejectRestaurant);

// DRIVER APPROVAL
router.post("/drivers/approve/:id", approveDriver);
router.post("/drivers/reject/:id", rejectDriver);

export default router;
