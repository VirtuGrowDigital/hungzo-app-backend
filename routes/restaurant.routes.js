// import express from "express";
// import { registerRestaurant } from "../controllers/restaurant.controller.js";

// const router = express.Router();

// router.post("/register", registerRestaurant);

// export default router;


import express from "express";
import {
  registerRestaurant,
  updateRestaurantProfile,
} from "../controllers/restaurant.controller.js";

import { protect, requireRole } from "../middlewares/jwtAuth.js";
import restaurantProfileUpload from "../middlewares/restaurantProfileUpload.js";
import { compressImage } from "../middlewares/imageCompress.js";


const router = express.Router();

// Authenticated Restaurant actions (future use)
router.use(protect);
router.use(requireRole("RESTAURANT"));


// Restaurant registration
router.post("/register", compressImage, restaurantProfileUpload.single("profilePic"), registerRestaurant);

// update profile
router.put("/profile", compressImage, restaurantProfileUpload.single("profilePic"), updateRestaurantProfile);

//Self protected route:
// router.get("/profile", (req, res) => {
//   res.json({ msg: "Restaurant profile", user: req.user });
// });

export default router;
