const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  lottery: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lottery",
    required: true,
  },
  Address: {
    type: String,
    required: false,
  },
  ticketNumber: { type: String, required: true, unique: true }, // Unique ticket number for the lottery
  createdAt: { type: Date, default: Date.now },
});

const Ticket = mongoose.model("Ticket", ticketSchema);
module.exports = Ticket;
