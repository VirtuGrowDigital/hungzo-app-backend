import express from "express";
import {
  createProduct,
  myProducts,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import { protect, requireRole } from "../middlewares/jwtAuth.js";

const router = express.Router();

router.use(protect);
router.use(requireRole("ADMIN", "SUPERADMIN"));

// Product CRUD
router.post("/", createProduct);
router.get("/my", myProducts);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);


export default router;
