const ethers = require("ethers");
const dotenv = require("dotenv");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Buyer = require("../Models/BuyerModel");
const Ticket = require("../Models/TicketModel");
const Lottery = require("../Models/LotteryModel");
const tokenABI = require("../Contract/ContractAbi");

// Ethereum provider and wallet setup using Infura
const provider = new ethers.providers.JsonRpcProvider(
  process.env.INFURA_RPC_URL
);
const walletPrivateKey = process.env.PRIVATE_KEY;
const wallet = new ethers.Wallet(walletPrivateKey, provider);

const tokenContractAddress = process.env.TOKEN_CONTRACT_ADDRESS;
const tokenContract = new ethers.Contract(
  tokenContractAddress,
  tokenABI.abi,
  wallet
);
dotenv.config();

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

// async function winnerSelectionCron() {
//   try {
//     const expiredLotteries = await findExpiredLotteries();
//     console.log(expiredLotteries, "expiredLotteries");
//     const updatedLotteries = [];

//     for (const lottery of expiredLotteries) {
//       const winnerTicket = await selectRandomWinner(lottery._id);
//       if (winnerTicket) {
//         const updatedLottery = await Lottery.findByIdAndUpdate(
//           lottery._id,
//           { Winner: winnerTicket.Address },
//           { new: true } // This option returns the updated document
//         );
//         updatedLotteries.push(updatedLottery);
//       }
//       console.log(updatedLotteries, "updated Winner By Cron ");
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }

async function winnerSelectionCron() {
  try {
    const expiredLotteries = await findExpiredLotteries();
    console.log(expiredLotteries, "expiredLotteries");
    const updatedLotteries = [];

    for (const lottery of expiredLotteries) {
      const winnerTicket = await selectRandomWinner(lottery._id);
      if (winnerTicket) {
        try {
          // Convert the prize amount to the appropriate token units (assuming prize amount is already in token decimals)
          const prizeAmount = ethers.parseUnits(lottery.Prize.toString(), 18);

          // Transfer tokens to the winner
          const transactionResponse = await tokenContract.transfer(
            winnerTicket.Address,
            prizeAmount
          );
          const receipt = await transactionResponse.wait();

          if (receipt.status === 1) {
            // Transaction successful
            // Update the lottery with the winner's address and mark as claimed
            const updatedLottery = await Lottery.findByIdAndUpdate(
              lottery._id,
              { Winner: winnerTicket.Address, Claimed: true },
              { new: true }
            );
            updatedLotteries.push(updatedLottery);
            console.log(
              `Prize transferred successfully to ${winnerTicket.Address} for Lottery ${lottery.LotteryNumber}`
            );
          } else {
            console.error(
              `Transaction failed for Lottery ${lottery.LotteryNumber}`
            );
          }
        } catch (error) {
          console.error(
            `Error transferring prize for Lottery ${lottery.LotteryNumber}:`,
            error.message
          );
        }
      }
    }

    console.log(updatedLotteries, "updated Winner By Cron");
  } catch (error) {
    console.error("Error in winner selection cron job:", error.message);
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

module.exports = { getAddressDetails };

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
