const dotenv = require("dotenv");
const mongoose = require("mongoose");
const Lottery = require("../Models/LotteryModel");
const Ticket = require("../Models/TicketModel");

dotenv.config();

const createLottery = async (req, res) => {
  console.log(req.body);
  const { LotteryNumber, Prize, TicketPrice, Address, Winner, start, end } =
    req.body;

  // if (
  //   !Array.isArray(Address) ||
  //   Address.some((addr) => typeof addr !== "string")
  // ) {
  //   return res.status(400).json({ error: "Invalid Address format" });
  // }
  // Check if a lottery with the same LotteryNumber already exists
  const existingLottery = await Lottery.findOne({ LotteryNumber });

  if (existingLottery) {
    // If a lottery with the same number exists, return a 400 status with an error message
    return res
      .status(400)
      .json({ error: "Lottery with this number already exists" });
  }
  const lottery = new Lottery({
    LotteryNumber,
    Prize,
    TicketPrice,
    Address,
    Winner,
    start,
    end,
  });

  console.log(lottery, "lottery");
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

// all Lotteries and their tickets an address has bought
async function getAddressDetails(req, res) {
  try {
    const { address } = req.params;

    if (!address) {
      return res.status(400).json({ error: "Address is required" });
    }

    // Find all tickets associated with the address
    const tickets = await Ticket.find({ Address: address });

    // Extract the lottery IDs from the tickets
    const lotteryIds = tickets.map((ticket) => ticket.lottery);

    // Find all lotteries where the user holds a ticket
    const lotteries = await Lottery.find({ _id: { $in: lotteryIds } }).populate(
      {
        path: "tickets",
        match: { Address: address }, // Only populate tickets belonging to the specified address
      }
    );

    // Combine the results into a single response object
    const result = {
      address,
      lotteries,
    };

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching address details:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function activeLotteries(req, res) {
  try {
    const now = new Date();
    const activeLotteries = await Lottery.find({ end: { $gt: now } });

    const lotteriesWithRemainingTime = activeLotteries.map((lottery) => {
      const remainingTimeInSeconds = Math.floor(
        (new Date(lottery.end) - now) / 1000
      );
      return {
        heading: lottery.LotteryNumber,
        duration: remainingTimeInSeconds,
      };
    });

    res.status(200).json(lotteriesWithRemainingTime);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

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
  activeLotteries,
};
