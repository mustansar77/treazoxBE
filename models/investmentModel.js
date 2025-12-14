const mongoose = require("mongoose");

const investmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
    amount: { type: Number, required: true },
    dailyEarning: { type: Number, required: true },
    status: { type: String, enum: ["pending", "processing", "active"], default: "pending" },
    // paymentProof: { type: String },
    startDate: { type: Date },
    endDate: { type: Date },
    totalEarned: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Investment", investmentSchema);
