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
  TicketPrice: {
    type: Number,
    required: true,
  },
  Winner: {
    type: String,
    required: false,
    default: null,
  },
  Claimed: {
    type: Boolean,
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
  // Reference to the Ticket model
  tickets: [{ type: mongoose.Schema.Types.ObjectId, ref: "Ticket" }],
});

module.exports = mongoose.model("Lottery", lottery);
