/* eslint-disable no-undef */
const express = require("express");
const authController = require("../controllers/authController.js");
const router = express.Router();

router.post("/signup", authController.signup);
router.get("/login", authController.signin);
router.post("/signout", authController.signout);
router.post("/sendCode", authController.sendCode);
router.patch("/verifyCode", authController.verifyCode);

module.exports = router;
