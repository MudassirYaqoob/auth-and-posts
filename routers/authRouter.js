/* eslint-disable no-undef */
const express = require("express");
const authController = require("../controllers/authController.js");
const { identifier } = require("../middlewares/identification.js");
const router = express.Router();

router.post("/signup", authController.signup);
router.get("/login", authController.signin);
router.post("/signout", identifier, authController.signout);
router.post("/sendCode", identifier, authController.sendCode);
router.patch("/verifyCode", identifier, authController.verifyCode);
router.post("/change-password", identifier, authController.changePassword);
router.post("/forgot-password");
router.post("/verify-forgot-password");
module.exports = router;
