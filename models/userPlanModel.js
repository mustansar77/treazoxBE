const mongoose = require("mongoose");

const userPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: { type: mongoose.Schema.Types.ObjectId, ref: "Plan", required: true },
    amountInvested: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "activated"],
      default: "pending",
    },
    dailyEarning: { type: Number, required: true },
    totalEarning: { type: Number, default: 0 }, // earned so far
    durationLeft: { type: Number }, // decrease each day
    activatedAt: { type: Date },
    paymentProof: { type: String }, // optional: image url or file path
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserPlan", userPlanSchema);
