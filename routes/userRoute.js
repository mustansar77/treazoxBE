const express = require("express");
const router = express.Router();
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");
const { signup, login , updateUserBalance } = require("../controllers/userController");

router.post("/signup", signup);
router.post("/login", login);
router.put("/balance/:userId", authenticate, authorizeRoles("admin"), updateUserBalance);

module.exports = router;
