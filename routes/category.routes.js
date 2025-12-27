import express from "express";
import {
  createCategory,
  deleteCategory,
  getProductsByCategory,
  getAllCategories,
  getMenu,
} from "../controllers/category.controller.js";
import { protect, requireRole } from "../middlewares/jwtAuth.js";


const router = express.Router();

// for users 
router.get("/menu", getMenu);
router.get("/products/:categoryId", getProductsByCategory);
router.get("/all", getAllCategories);

// protected routes for admin
router.use(protect);
router.use(requireRole("ADMIN", "SUPERADMIN"));

router.post("/create", createCategory);
router.delete("/delete/:id", deleteCategory);

export default router;
