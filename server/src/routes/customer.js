const express = require("express");

const CustomerController = require("../controllers/CustomerController");
const jwtAuth = require("../midlewares/jwtAuth");

let router = express.Router();

router.post("/register", CustomerController.register);

router.get("/verify-email", CustomerController.verifyEmail);

router.post("/login", CustomerController.login);

router.post("/logout", CustomerController.logout);

router.post("/refresh", CustomerController.refreshAccessToken);

router.get("/infor", jwtAuth, CustomerController.getInfor);

router.put("/update", jwtAuth, CustomerController.update);

router.put("/change-password", jwtAuth, CustomerController.changePassword);

router.post("/forgot-password", CustomerController.forgotPassword);

router.put("/reset-password", CustomerController.resetPassword);

module.exports = router;
