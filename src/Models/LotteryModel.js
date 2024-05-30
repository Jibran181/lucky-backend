const mongoose = require("mongoose");
const lottery = new mongoose.Schema({
  LotteryNumber: {
    type: Number,
    required: true,
  },
  Address: {
    type: [String],
    required: true,
  },
  Winner: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Lottery", lottery);
