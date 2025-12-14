const express = require("express");
const router = express.Router();
const { updateUserBalance, getUserBalance } = require("../controllers/balanceController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

router.post("/update", authenticate, authorizeRoles("admin"), updateUserBalance);
router.get("/:userId", authenticate, authorizeRoles("admin"), getUserBalance);

module.exports = router;
