// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { isAdmin } = require("../middleware/adminMiddleware");

// Create new user (by admin)
router.post("/users", isAdmin, adminController.createUser);

// Get all users
router.get("/users", isAdmin, adminController.getAllUsers);

// Update user password
router.put("/users/:id/password", isAdmin, adminController.updateUserPassword);
router.put("/users/:id", adminController.updateUser);
// Delete user
router.delete("/users/:id", isAdmin, adminController.deleteUser);

router.get("/user-stats", isAdmin, adminController.getUserStats);

module.exports = router;
