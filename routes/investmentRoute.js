const express = require("express");
const router = express.Router();
const {
  createInvestment,
  updateInvestmentStatus,
  getDashboard,
   getPendingInvestments
} = require("../controllers/investmentController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

// USER: submit plan payment
router.post("/", authenticate, createInvestment);

// ADMIN: update investment status
router.put("/:id/status", authenticate, authorizeRoles("admin"), updateInvestmentStatus);

// USER: get dashboard
router.get("/dashboard", authenticate, getDashboard);

// ADMIN: get all pending investments
router.get("/pending", authenticate, authorizeRoles("admin"), getPendingInvestments);

module.exports = router;
