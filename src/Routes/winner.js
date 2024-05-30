const express = require("express");
const controller = require("../Controller/WinnerController.js");
const router = express.Router();

router.post("/addWinner", controller.CreateWinner);
router.get("/", controller.readAll);

module.exports = router;
