const express = require("express");

const AdminController = require("../controllers/AdminController");

let router = express.Router();

router.post("/register", AdminController.registerAdmin);

router.post("/login", AdminController.loginAdmin);

router.post("/users", AdminController.registerUser);

router.put("/users/:user_id", AdminController.updateUser);

router.delete("/users/:user_id", AdminController.deleteUserByAdmin);

router.get("/users", AdminController.listUsers);

router.get("/users/:user_id", AdminController.getUserById);

module.exports = router;
