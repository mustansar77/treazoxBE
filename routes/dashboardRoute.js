const express = require("express");
const router = express.Router();
const { getUserDashboard } = require("../controllers/dashboardController");
const { authenticate } = require("../middleware/authMiddleware");

router.get("/", authenticate, getUserDashboard);

module.exports = router;
