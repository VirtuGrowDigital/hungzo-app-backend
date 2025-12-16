// import express from "express";
// import { adminLogin } from "../controllers/admin.controller.js";

// const router = express.Router();

// router.post("/login", adminLogin);

// export default router;


import express from "express";
import {
  createAdmin,
  listAdmins,
  deleteAdmin,
} from "../controllers/admin.controller.js";

import {
  approveRestaurant,
  rejectRestaurant,
  getPendingRestaurants,
} from "../controllers/restaurant.controller.js";

import {
  approveDriver,
  rejectDriver,
  getPendingDrivers,
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
router.get("/restaurants/pending", getPendingRestaurants);
router.post("/restaurants/approve/:id", approveRestaurant);
router.post("/restaurants/reject/:id", rejectRestaurant);

// DRIVER APPROVAL
router.get("/drivers/pending", getPendingDrivers);
router.post("/drivers/approve/:id", approveDriver);
router.post("/drivers/reject/:id", rejectDriver);

export default router;
