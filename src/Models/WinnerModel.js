const mongoose = require("mongoose");
const lotterySchema = new mongoose.Schema({
  LotteryNo: {
    type: Number,
    required: true,
  },
  Claimed: {
    type: Boolean,
    required: true,
  },
});
const winner = new mongoose.Schema({
  Address: {
    type: String,
    required: true,
  },
  LotteryNumbers: {
    type: [lotterySchema],
    required: true,
  },
});

module.exports = mongoose.model("Winner", winner);
