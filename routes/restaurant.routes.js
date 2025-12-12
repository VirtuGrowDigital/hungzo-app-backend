import express from "express";
import { registerRestaurant } from "../controllers/restaurant.controller.js";

const router = express.Router();

router.post("/register", registerRestaurant);

export default router;
