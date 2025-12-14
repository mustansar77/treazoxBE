const express = require("express");
const router = express.Router();
const { activatePlanRequest, updatePlanStatus } = require("../controllers/userPlanController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

// User submit plan
router.post("/activate", authenticate, activatePlanRequest);

// Admin update status
router.post("/status", authenticate, authorizeRoles("admin"), updatePlanStatus);

module.exports = router;
