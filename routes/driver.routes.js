// import express from "express";
// import { registerDriver } from "../controllers/driver.controller.js";

// const router = express.Router();

// router.post("/register", registerDriver);

// export default router;


import express from "express";
import {
  registerDriver,
} from "../controllers/driver.controller.js";

import { protect, requireRole } from "../middlewares/jwtAuth.js";
import firebaseAuthMiddleware from "../middlewares/firebaseAuth.js";

const router = express.Router();

// Driver registration
router.post("/register", firebaseAuthMiddleware, registerDriver);

// Authenticated Driver section
router.use(protect);
router.use(requireRole("DRIVER"));

router.get("/profile", (req, res) => {
  res.json({ msg: "Driver profile", user: req.user });
});

export default router;
