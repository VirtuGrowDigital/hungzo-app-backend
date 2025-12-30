import express from "express";
import {
  firebaseLogin,
  refresh,
  logout,
} from "../controllers/auth.controller.js";
import { adminLogin } from "../controllers/admin.controller.js";
import firebaseAuthMiddleware from "../middlewares/firebaseAuth.js";

const router = express.Router();

// Mobile login via Firebase (Restaurant & Driver)
router.post("/firebase-login", firebaseAuthMiddleware, firebaseLogin);

// Admin login
router.post("/admin/login", adminLogin);

// Refresh access token
router.post("/refresh", refresh);

// Logout
router.post("/logout", logout);

export default router;
