const Withdraw = require("../models/withdrawModel");
const User = require("../models/userModel");

// =======================
// USER: Submit Withdraw Request
// =======================
exports.createWithdraw = async (req, res) => {
  try {
    const userId = req.user._id;
    const { amount } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (amount > user.walletInfo) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    // Deduct from wallet temporarily
    user.walletInfo -= amount;
    await user.save();

    const withdraw = await Withdraw.create({
      user: userId,
      amount,
      status: "pending",
    });

    res.status(201).json({ message: "Withdraw request submitted", withdraw });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =======================
// ADMIN: Update Withdraw Status
// =======================
exports.updateWithdrawStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // approved / rejected

    const withdraw = await Withdraw.findById(id).populate("user");
    if (!withdraw) return res.status(404).json({ message: "Withdraw request not found" });

    if (withdraw.status !== "pending") {
      return res.status(400).json({ message: "Withdraw request already processed" });
    }

    if (status === "rejected") {
      // Refund user
      withdraw.user.walletInfo += withdraw.amount;
      await withdraw.user.save();
    }

    withdraw.status = status;
    await withdraw.save();

    res.json({ message: `Withdraw request ${status}`, withdraw });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =======================
// ADMIN: Get All Withdraw Requests
// =======================
exports.getAllWithdraws = async (req, res) => {
  try {
    const withdraws = await Withdraw.find().populate("user", "fullName email walletInfo");
    res.json(withdraws);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =======================
// USER: Get Own Withdraw Requests
// =======================
exports.getUserWithdraws = async (req, res) => {
  try {
    const userId = req.user._id;
    const withdraws = await Withdraw.find({ user: userId });
    res.json(withdraws);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
