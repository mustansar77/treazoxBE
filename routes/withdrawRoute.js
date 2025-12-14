const express = require("express");
const router = express.Router();
const {
  createWithdraw,
  updateWithdrawStatus,
  getAllWithdraws,
  getUserWithdraws,
} = require("../controllers/withdrawController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

// USER: submit withdraw request
router.post("/", authenticate, createWithdraw);

// USER: get own withdraws
router.get("/me", authenticate, getUserWithdraws);

// ADMIN: get all withdraw requests
router.get("/all", authenticate, authorizeRoles("admin"), getAllWithdraws);

// ADMIN: update withdraw status
router.put("/:id/status", authenticate, authorizeRoles("admin"), updateWithdrawStatus);

module.exports = router;
