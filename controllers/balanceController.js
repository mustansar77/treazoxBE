const User = require("../models/userModel");

exports.updateUserBalance = async (req, res) => {
  try {
    const { userId, balance } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.walletInfo = balance;
    await user.save();

    res.json({ message: "Balance updated", walletBalance: user.walletInfo });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

exports.getUserBalance = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ walletBalance: user.walletInfo });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
