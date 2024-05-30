const express = require("express");
require("dotenv").config();
require("./mongo");
const OwnerRoutes = require("./src/Routes/owner");
const WinnerRoutes = require("./src/Routes/winner");
const BuyerRoutes = require("./src/Routes/buyer");
const LotteryRoutes = require("./src/Routes/lottery");
const app = express();
app.use(express.json());
app.listen(process.env.PORT, () => {
  console.log(`Server Running on port ${process.env.PORT}`);
});
app.use("/Owner", OwnerRoutes);
app.use("/Winner", WinnerRoutes);
app.use("/buyer", BuyerRoutes);
app.use("/lottery", LotteryRoutes);
