const express = require("express");
const controller = require("../Controller/LotteryController.js");
const router = express.Router();

router.post("/addLottery", controller.createLottery);
router.put("/updateLottery", controller.updateLottery);
router.get("/active-lotteries", controller.activeLotteries);
router.get("/check/:address", controller.getAddressDetails); // Route to get all tickets and lotteries for a specific address
router.get("/", controller.readAll);

module.exports = router;
