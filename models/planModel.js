const mongoose = require("mongoose");

const planSchema = new mongoose.Schema(
  {
    totalPrice: { type: Number, required: true },
    duration: { type: Number, required: true }, // in days
    dailyEarning: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Plan", planSchema);
