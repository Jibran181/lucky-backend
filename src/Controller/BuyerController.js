const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Buyer = require("../Models/BuyerModel");

dotenv.config();

// const createBuyer = async (req, res) => {
//   console.log(req.body);
//   const { Address, lotteryNumber } = req.body;

//   if (
//     !Array.isArray(lotteryNumber) ||
//     lotteryNumber.some((num) => typeof num !== "string")
//   ) {
//     return res.status(400).json({ error: "Invalid lotteryNumber format" });
//   }

//   const buyer = new Buyer({
//     // _id: new mongoose.Types.ObjectId(),
//     Address,
//     lotteryNumber,
//   });

//   return buyer
//     .save()
//     .then((buyer) => res.status(201).json({ buyer }))
//     .catch((error) => {
//       console.log(error);
//       res.status(400).json({ error });
//     });
// };


const createBuyer = async (req, res) => {
  try {
    const { Address, lotteryNumber } = req.body;

    // Validate input
    if (!Address || typeof Address !== "string" || typeof lotteryNumber !== "string") {
      return res.status(400).json({ error: "Invalid input format" });
    }

    // Find or create a new buyer
    let buyer = await Buyer.findOne({ Address });

    if (buyer) {
      // If buyer exists, add the new lottery number to the existing list if not already present
      if (!buyer.lotteryNumber.includes(lotteryNumber)) {
        buyer.lotteryNumber.push(lotteryNumber);
      }
    } else {
      // If buyer does not exist, create a new one
      buyer = new Buyer({
        Address,
        lotteryNumber: [lotteryNumber],
      });
    }

    // Save the buyer to the database
    const savedBuyer = await buyer.save();
    res.status(201).json({ buyer: savedBuyer });
  } catch (error) {
    console.error("Error creating or updating buyer:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
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
