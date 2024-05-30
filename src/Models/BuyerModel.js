const mongoose = require("mongoose");
const buyer = new mongoose.Schema({
  Address: {
    type: String,
    required: true,
  },
  lotteryNumber: {
    type: [String],
    required: true,
  },
});

module.exports = mongoose.model("Buyer", buyer);
