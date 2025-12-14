const express = require("express");
const router = express.Router();
const {
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  deleteAllPlans,
} = require("../controllers/planController");

const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

// ✅ Create plan (Admin only)
router.post("/", authenticate, authorizeRoles("admin"), createPlan);

// ✅ Get all plans (any authenticated user)
router.get("/", authenticate, getPlans);

// ✅ Get single plan by ID
router.get("/:id", authenticate, getPlanById);

// ✅ Update plan by ID (Admin only)
router.put("/:id", authenticate, authorizeRoles("admin"), updatePlan);

// ✅ Delete single plan by ID (Admin only)
router.delete("/:id", authenticate, authorizeRoles("admin"), deletePlan);

// ✅ Delete all plans (Admin only)
router.delete("/", authenticate, authorizeRoles("admin"), deleteAllPlans);

module.exports = router;
