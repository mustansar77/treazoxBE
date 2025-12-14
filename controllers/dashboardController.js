const UserPlan = require("../models/userPlanModel");
const User = require("../models/userModel");

exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const userPlans = await UserPlan.find({ user: userId, status: "activated" });

    const totalPlansActivated = userPlans.length;
    const totalInvestment = userPlans.reduce((acc, p) => acc + p.amountInvested, 0);
    const totalDailyEarning = userPlans.reduce((acc, p) => acc + p.dailyEarning, 0);
    const totalEarning = userPlans.reduce((acc, p) => acc + p.totalEarning, 0);

    const user = await User.findById(userId);

    res.json({
      totalPlansActivated,
      totalInvestment,
      totalDailyEarning,
      totalEarning,
      walletBalance: user.walletInfo,
      plans: userPlans,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
