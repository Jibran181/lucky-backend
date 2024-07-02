const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Lottery = require("../Models/LotteryModel");

dotenv.config();

const createLottery = async (req, res) => {
  console.log(req.body);
  const { LotteryNumber, Prize, Address, Winner, start, end } = req.body;

  if (
    !Array.isArray(Address) ||
    Address.some((addr) => typeof addr !== "string")
  ) {
    return res.status(400).json({ error: "Invalid Address format" });
  }

  const lottery = new Lottery({
    _id: new mongoose.Types.ObjectId(),
    LotteryNumber,
    Prize,
    Address,
    Winner,
    start,
    end,
  });

  return lottery
    .save()
    .then((lottery) => res.status(201).json({ lottery }))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

const updateLottery = async (req, res) => {
  const { id } = req.params;
  const { LotteryNumber, Prize, Address, Winner, start, end } = req.body;

  if (
    Address &&
    (!Array.isArray(Address) ||
      Address.some((addr) => typeof addr !== "string"))
  ) {
    return res.status(400).json({ error: "Invalid Address format" });
  }

  return Lottery.findByIdAndUpdate(
    id,
    { LotteryNumber, Prize, Address, Winner, start, end },
    { new: true, runValidators: true }
  )
    .then((lottery) => {
      if (!lottery) {
        return res.status(404).json({ message: "Lottery not found" });
      }
      return res.status(200).json({ lottery });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};
const readAll = (req, res) => {
  Lottery.find()
    .exec()
    .then((Lottery) => res.status(200).json({ Lottery }))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};
module.exports = {
  createLottery,
  updateLottery,
  readAll,
};
