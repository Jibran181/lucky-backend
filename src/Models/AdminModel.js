const mongoose = require("mongoose");
const admin = new mongoose.Schema({
  UserName: {
    type: String,
    required: true,
  },
  Password: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Admin", admin);
