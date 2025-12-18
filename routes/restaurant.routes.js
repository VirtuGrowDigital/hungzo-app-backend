// import express from "express";
// import { registerRestaurant } from "../controllers/restaurant.controller.js";

// const router = express.Router();

// router.post("/register", registerRestaurant);

// export default router;


import express from "express";
import {
  registerRestaurant,
} from "../controllers/restaurant.controller.js";

import { protect, requireRole } from "../middlewares/jwtAuth.js";


const router = express.Router();

// Authenticated Restaurant actions (future use)
router.use(protect);
router.use(requireRole("RESTAURANT"));


// Restaurant registration
router.post("/register", registerRestaurant);

//Self protected route:
router.get("/profile", (req, res) => {
  res.json({ msg: "Restaurant profile", user: req.user });
});

export default router;
