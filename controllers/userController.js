const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

// Generate JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

// =======================
//       SIGNUP
// =======================
exports.signup = async (req, res) => {
  try {
    const { fullName, email, phone, password, referralCode } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "Email already registered" });

    let referredBy = null;
    if (referralCode) {
      const refUser = await User.findOne({ referralCode });
      if (!refUser) {
        return res.status(400).json({ message: "Invalid referral code" });
      }
      referredBy = referralCode;
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      phone,
      password: hashed,
      referredBy,
    });

    res.status(201).json({
      message: "Signup successful",
      newUser,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =======================
//        LOGIN
// =======================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Invalid email or password" });

    // hide password
    const { password: pwd, ...userData } = user._doc;

    res.json({
      message: "Login successful",
      token: generateToken(user._id),
      user: userData, // includes correct role
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};




exports.updateUserBalance = async (req, res) => {
  try {
    const { userId } = req.params;
    const { amount } = req.body; // amount can be positive (add) or negative (deduct)

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.walletInfo += amount; // update balance
    await user.save();

    res.json({
      message: "User balance updated successfully",
      walletInfo: user.walletInfo,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};