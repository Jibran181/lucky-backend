const dotenv = require("dotenv");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Buyer = require("../Models/BuyerModel");
const Ticket = require("../Models/TicketModel");
const Lottery = require("../Models/LotteryModel");

dotenv.config();

// const purchaseTicket = async (req, res) => {
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

async function findExpiredLotteries() {
  const now = new Date();
  return Lottery.find({ end: { $lt: now }, Winner: null || "" });
}
// random winner
async function selectRandomWinner(lotteryId) {
  const tickets = await Ticket.find({ lottery: lotteryId });
  if (tickets.length === 0) return null;

  const randomIndex = Math.floor(Math.random() * tickets.length);
  return tickets[randomIndex];
}
//updateLotteryWithWinner
async function updateLotteryWithWinner(lotteryId, winnerAddress) {
  await Lottery.findByIdAndUpdate(lotteryId, { Winner: winnerAddress });
}

//winner selection for api endPoint

const winnerSelection = async (req, res) => {
  try {
    const expiredLotteries = await findExpiredLotteries();
    console.log(expiredLotteries, "expiredLotteries");
    const updatedLotteries = [];

    for (const lottery of expiredLotteries) {
      const winnerTicket = await selectRandomWinner(lottery._id);
      console.log(winnerTicket, "winnerTicket");
      if (winnerTicket) {
        const updatedLottery = await Lottery.findByIdAndUpdate(
          lottery._id,
          { Winner: winnerTicket.Address },
          { new: true } // This option returns the updated document
        );
        updatedLotteries.push(updatedLottery);
      }
    }

    res.status(200).json({
      message: "Expired lotteries checked and winners updated.",
      updatedLotteries,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function winnerSelectionCron() {
  try {
    const expiredLotteries = await findExpiredLotteries();
    console.log(expiredLotteries, "expiredLotteries");
    const updatedLotteries = [];

    for (const lottery of expiredLotteries) {
      const winnerTicket = await selectRandomWinner(lottery._id);
      if (winnerTicket) {
        const updatedLottery = await Lottery.findByIdAndUpdate(
          lottery._id,
          { Winner: winnerTicket.Address },
          { new: true } // This option returns the updated document
        );
        updatedLotteries.push(updatedLottery);
      }
      console.log(updatedLotteries, "updated Winner By Cron ");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

// BUYING TICKET Api
const purchaseTicket = async (req, res) => {
  try {
    const { Address, lotteryNumber } = req.body;
    console.log("errr", Address);

    // Validate input
    if (!Address || typeof Address !== "string") {
      return res.status(400).json({ error: "Invalid input format" });
    }

    // Find the lottery and user
    const lottery = await Lottery.findOne({ lotteryNumber });

    if (!lottery) {
      return res.status(404).json({ message: "Lottery not found" });
    }

    if (lottery.Winner) {
      return res.status(404).json({ message: "Winner Already  Declared" });
    }
    // Generate a unique ticket number
    const ticketNumber = crypto.randomBytes(4).toString("hex"); // Example: Generates a random 8-character string

    // Create a new ticket
    const ticket = new Ticket({
      lottery: lottery._id,
      Address: Address,
      ticketNumber,
    });

    // Save the ticket
    const ticketPurchased = await ticket.save();
    res.status(201).json({ ticketPurchased: ticketPurchased });
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
  purchaseTicket,
  readByLotteryNumber,
  readAll,
  winnerSelection,
  winnerSelectionCron,
};
