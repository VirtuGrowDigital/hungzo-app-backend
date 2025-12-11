const express = require("express");
const { mockLogin } = require("../controllers/auth.controller");
const router = express.Router();

router.post("/login", mockLogin);

module.exports = router;
