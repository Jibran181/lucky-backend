const mongoose = require("mongoose");
const lottery = new mongoose.Schema({
  LotteryNumber: {
    type: Number,
    required: true,
    unique: true, 
  },
  Prize: {
    type: Number,
    required: true,
  },
  Address: {
    type: [String],
    required: false,
  },
  Winner: {
    type: String,
    required: false,
  },
  start: {
    type: Date,
    required: true,
  },
  end: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Lottery", lottery);
