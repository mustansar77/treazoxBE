const Investment = require("../models/investmentModel");
const Plan = require("../models/planModel");
const User = require("../models/userModel");

// =======================
// USER: Create Investment
// =======================
exports.createInvestment = async (req, res) => {
  try {
    const { planId, amount } = req.body;
    const userId = req.user._id;

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    if (amount !== plan.totalPrice) {
      return res.status(400).json({ message: "Amount does not match plan price" });
    }

    const investment = await Investment.create({
      user: userId,
      plan: planId,
      amount,
      dailyEarning: plan.dailyEarning,
      status: "pending",
      startDate: null,
      endDate: null,
      totalEarned: 0,
    });

    res.status(201).json({
      message: "Investment submitted, waiting for admin approval",
      investment,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =======================
// GET PENDING INVESTMENTS
// =======================
exports.getPendingInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ status: "pending" })
      .populate("user", "fullName email phone")
      .populate("plan", "totalPrice dailyEarning duration");

    res.json(investments);

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =======================
// ADMIN: Update Status + Referral Earnings
// =======================
exports.updateInvestmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const investment = await Investment.findById(id).populate("plan").populate("user");
    if (!investment) return res.status(404).json({ message: "Investment not found" });

    investment.status = status;

    if (status === "active") {
      investment.startDate = new Date();
      investment.endDate = new Date(Date.now() + investment.plan.duration * 24 * 60 * 60 * 1000);

      // ===========================
      // REFERRAL PAYOUT (3 Levels)
      // ===========================
     const level1 = investment.user.referredBy
  ? await User.findOne({ referralCode: investment.user.referredBy })
  : null;

if (level1) {
  level1.walletInfo += investment.amount * 0.10; // 10%
  await level1.save();
}

const level2 = level1 && level1.referredBy
  ? await User.findOne({ referralCode: level1.referredBy })
  : null;

if (level2) {
  level2.walletInfo += investment.amount * 0.07; // 7%
  await level2.save();
}

const level3 = level2 && level2.referredBy
  ? await User.findOne({ referralCode: level2.referredBy })
  : null;

if (level3) {
  level3.walletInfo += investment.amount * 0.03; // 3%
  await level3.save();
}
    }

    await investment.save();
    res.json({ message: "Investment status updated", investment });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =======================
// USER DASHBOARD
// =======================
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const investments = await Investment.find({
      user: userId,
      status: "active",
    });

    const totalActivatedPlans = investments.length;
    const totalInvestment = investments.reduce((s, i) => s + i.amount, 0);
    const dailyEarning = investments.reduce((s, i) => s + i.dailyEarning, 0);

    let totalEarnings = 0;
    const today = new Date();

    investments.forEach((inv) => {
      if (!inv.startDate) return;

      const start = new Date(inv.startDate);
      const end = inv.endDate && inv.endDate < today ? inv.endDate : today;

      let days = Math.ceil(
        (end - start) / (1000 * 60 * 60 * 24)
      );

      // ✅ minimum 1 day earning
      days = Math.max(days, 1);

      totalEarnings += days * inv.dailyEarning;
    });

    res.json({
      totalActivatedPlans,
      totalInvestment,
      dailyEarning,
      totalEarnings,
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

