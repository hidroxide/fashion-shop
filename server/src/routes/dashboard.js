const express = require("express");

const DashboardController = require("../controllers/DashboardController");

let router = express.Router();

router.get("/revenue", DashboardController.revenueChart);

router.get("/revenue/daily", DashboardController.revenueByDay);

router.get("/revenue/category", DashboardController.revenueByCategory);

module.exports = router;
