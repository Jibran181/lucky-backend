const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
require("dotenv").config();
require("./mongo");
const OwnerRoutes = require("./src/Routes/owner");
const WinnerRoutes = require("./src/Routes/winner");
const BuyerRoutes = require("./src/Routes/buyer");
const LotteryRoutes = require("./src/Routes/lottery");
const AdminRoutes = require("./src/Routes/admin");
const { winnerSelectionCron } = require("./src/Controller/BuyerController");
const app = express();
app.use(express.json());
app.use(cors());
app.listen(process.env.PORT, () => {
  console.log(`Server Running on port ${process.env.PORT}`);
});
app.use("/Owner", OwnerRoutes);
app.use("/Winner", WinnerRoutes);
app.use("/buyer", BuyerRoutes);
app.use("/lottery", LotteryRoutes);
app.use("/admin", AdminRoutes);
app.get("/", function (req, res) {
  res.send("Lucky-backend");
});
cron.schedule("0 0 * * *", async () => {
  // Define the cron job to run every day at 12 PM
  // export async function schedule() {
  try {
    // Replace with the actual URL of your API endpoint
    await winnerSelectionCron();
    console.log("cron job runnig");
  } catch (error) {
    console.error("Error executing cron job:", error.message);
  }
});
