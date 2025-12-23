import express from "express";
import {
  addToCart,
  getCart,
  removeFromCart,
} from "../controllers/cart.controller.js";
import { protect } from "../middlewares/jwtAuth.js";

const router = express.Router();

// All cart routes require login
router.use(protect);

// Get current user's cart
router.get("/", getCart);

// Add product + variety to cart
router.post("/add", addToCart);

// Remove product + variety from cart
router.delete("/remove", removeFromCart);

export default router;
