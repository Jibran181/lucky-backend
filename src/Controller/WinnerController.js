const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Winner = require("../Models/WinnerModel");

dotenv.config();

const CreateWinner = async (req, res) => {
  console.log(req.body);
  const { Address, LotteryNumbers } = req.body;
  if (
    !Array.isArray(LotteryNumbers) ||
    LotteryNumbers.some(
      (item) =>
        typeof item.LotteryNo !== "number" || typeof item.Claimed !== "boolean"
    )
  ) {
    return res.status(400).json({ error: "Invalid LotteryNumbers format" });
  }

  const winner = new Winner({
    _id: new mongoose.Types.ObjectId(),
    Address,
    LotteryNumbers,
  });

  return winner
    .save()
    .then((winner) => res.status(201).json({ winner }))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

const readAll = (req, res) => {
  Winner.find()
    .exec()
    .then((Winner) => res.status(200).json({ Winner }))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};
module.exports = {
  CreateWinner,
  readAll,
};
