const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Buyer = require("../Models/BuyerModel");

dotenv.config();

const createBuyer = async (req, res) => {
  console.log(req.body);
  const { Address, lotteryNumber } = req.body;

  if (
    !Array.isArray(lotteryNumber) ||
    lotteryNumber.some((num) => typeof num !== "string")
  ) {
    return res.status(400).json({ error: "Invalid lotteryNumber format" });
  }

  const buyer = new Buyer({
    _id: new mongoose.Types.ObjectId(),
    Address,
    lotteryNumber,
  });

  return buyer
    .save()
    .then((buyer) => res.status(201).json({ buyer }))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

const readByLotteryNumber = async (req, res) => {
  const { lotteryNumber } = req.params;

  return Buyer.find({ lotteryNumber })
    .then((buyers) => {
      if (!buyers.length) {
        return res
          .status(404)
          .json({ message: "No buyers found with this lottery number" });
      }
      return res.status(200).json({ buyers });
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};

const readAll = (req, res) => {
  Buyer.find()
    .exec()
    .then((Buyer) => res.status(200).json({ Buyer }))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error });
    });
};
module.exports = {
  createBuyer,
  readByLotteryNumber,
  readAll,
};
