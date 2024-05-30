const mongoose = require("mongoose");
const owner = new mongoose.Schema({
  Address: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Owner", owner);
