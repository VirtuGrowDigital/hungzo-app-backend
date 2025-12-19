import express from "express";
import { registerDriver } from "../controllers/driver.controller.js";
import { protect, requireRole } from "../middlewares/jwtAuth.js";

const router = express.Router();

/**
 * All driver routes require:
 * - JWT
 * - Role DRIVER
 */
router.use(protect);
router.use(requireRole("DRIVER"));

/**
 * Register driver profile
 */
router.post("/register", registerDriver);

/**
 * Driver profile
 */
router.get("/profile", (req, res) => {
  res.json({
    msg: "Driver profile",
    user: req.user,
  });
});

export default router;
