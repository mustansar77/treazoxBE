const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// =======================
// Create new user
// =======================
exports.createUser = async (req, res) => {
  try {
    const { fullName, email, phone, password, role = "user" } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      phone,
      password: hashed,
      role,
    });

    res.status(201).json({ message: "User created successfully", newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =======================
// Get all users
// =======================
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude password
    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =======================
// Get single user details
// =======================
exports.getUserDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =======================
// Update user details
// =======================
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, role, active } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update fields if provided
    if (fullName !== undefined) user.fullName = fullName;
    if (email !== undefined) user.email = email;
    if (phone !== undefined) user.phone = phone;
    if (role !== undefined) user.role = role;
    if (active !== undefined) user.active = active;

    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =======================
// Update user password
// =======================
exports.updateUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    if (!password) return res.status(400).json({ message: "Password required" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.findByIdAndUpdate(
      id,
      { password: hashed },
      { new: true }
    );

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =======================
// Delete user
// =======================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =======================
// Get user statistics
// =======================
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalActive = await User.countDocuments({ active: true });
    const totalInactive = await User.countDocuments({ active: false });
    const totalPremium = await User.countDocuments({ role: "premium" });

    res.json({
      totalUsers,
      totalActive,
      totalInactive,
      totalPremium,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
