const UserPlan = require("../models/userPlanModel");
const Plan = require("../models/planModel");
const User = require("../models/userModel");

// User activate plan (submit payment)
exports.activatePlanRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { planId, paymentProof } = req.body;

    const plan = await Plan.findById(planId);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    const existing = await UserPlan.findOne({ user: userId, plan: planId, status: { $ne: "activated" } });
    if (existing) return res.status(400).json({ message: "Plan already in progress or activated" });

    const userPlan = await UserPlan.create({
      user: userId,
      plan: planId,
      amountInvested: plan.totalPrice,
      dailyEarning: plan.dailyEarning,
      durationLeft: plan.duration,
      paymentProof,
      status: "pending",
    });

    res.status(201).json({ message: "Plan request submitted", userPlan });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Admin update status: pending -> processing -> activated
exports.updatePlanStatus = async (req, res) => {
  try {
    const { userPlanId, status } = req.body;

    if (!["pending", "processing", "activated"].includes(status))
      return res.status(400).json({ message: "Invalid status" });

    const userPlan = await UserPlan.findById(userPlanId).populate("user");
    if (!userPlan) return res.status(404).json({ message: "UserPlan not found" });

    userPlan.status = status;
    if (status === "activated") userPlan.activatedAt = new Date();

    await userPlan.save();
    res.json({ message: "Plan status updated", userPlan });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
