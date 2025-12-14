const Plan = require("../models/planModel");

// =======================
//      CREATE PLAN
// =======================
exports.createPlan = async (req, res) => {
  try {
    let { totalPrice, duration, dailyEarning } = req.body;

    // Convert to numbers if sent as string
    totalPrice = Number(totalPrice);
    duration = Number(duration);
    dailyEarning = Number(dailyEarning);

    if (!totalPrice || !duration || !dailyEarning) {
      return res
        .status(400)
        .json({ message: "All fields are required and must be numbers" });
    }

    // Avoid duplicate plan
    const existing = await Plan.findOne({ totalPrice, duration, dailyEarning });
    if (existing)
      return res.status(400).json({ message: "Plan already exists" });

    const plan = await Plan.create({ totalPrice, duration, dailyEarning });
    res.status(201).json({ message: "Plan created successfully", plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =======================
//      GET ALL PLANS
// =======================
exports.getPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: 1 }); // sorted by creation date
    res.json(plans);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =======================
//      GET SINGLE PLAN
// =======================
exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =======================
//      UPDATE PLAN
// =======================
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const { totalPrice, duration, dailyEarning } = req.body;

    const plan = await Plan.findById(id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    plan.totalPrice = totalPrice ?? plan.totalPrice;
    plan.duration = duration ?? plan.duration;
    plan.dailyEarning = dailyEarning ?? plan.dailyEarning;

    await plan.save();
    res.json({ message: "Plan updated successfully", plan });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =======================
//      DELETE SINGLE PLAN
// =======================
exports.deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });

    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: "Plan deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =======================
//      DELETE ALL PLANS
// =======================
exports.deleteAllPlans = async (req, res) => {
  try {
    await Plan.deleteMany({});
    res.json({ message: "All plans deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
