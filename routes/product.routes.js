import express from "express";
import {
  createProduct,
  myProducts,
  updateProduct,
  deleteProduct,
  getActiveProducts,
  getProductById,
} from "../controllers/product.controller.js";
import { protect, requireRole } from "../middlewares/jwtAuth.js";

const router = express.Router();

// Public user routes
router.get("/", getActiveProducts);
router.get("/:id", getProductById);


router.use(protect);
router.use(requireRole("ADMIN", "SUPERADMIN"));

// Product CRUD - Admin routes
router.post("/create", createProduct);
router.get("/admin/my", myProducts);
router.put("/update/:id", updateProduct);
router.delete("/delete/:id", deleteProduct);


export default router;
