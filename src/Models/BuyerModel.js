const mongoose = require("mongoose");
const buyer = new mongoose.Schema({
  Address: {
    type: String,
    required: true,
  },
  // lotteryNumber: {
  //   type: [String],
  //   required: true,
  // },
  // lotteries: [{
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Lottery'
  // }]
});

module.exports = mongoose.model("Buyer", buyer);
