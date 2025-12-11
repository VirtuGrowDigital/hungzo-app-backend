const express = require("express");
const { registerRestaurant } = require("../controllers/restaurant.controller");
const router = express.Router();

router.post("/register", registerRestaurant);

module.exports = router;
