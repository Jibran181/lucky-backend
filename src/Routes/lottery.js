const express = require("express");
const controller = require("../Controller/LotteryController.js");
const router = express.Router();

router.post("/addLottery", controller.createLottery);
router.put("/updateLottery", controller.updateLottery);
router.get("/active-lotteries", controller.activeLotteries);
router.get("/", controller.readAll);

module.exports = router;
