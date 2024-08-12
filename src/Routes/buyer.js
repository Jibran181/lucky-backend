const express = require("express");
const controller = require("../Controller/BuyerController.js");
const router = express.Router();

router.post("/addBuyer", controller.createBuyer);
router.post("/winnerSelection", controller.winnerSelection);

router.get("/", controller.readAll);
router.get("/allBuyer/:id", controller.readByLotteryNumber);
module.exports = router;
