const express = require("express");
const controller = require("../Controller/OwnerController.js");
const router = express.Router();

router.post("/addOwner", controller.CreateOwner);
router.put("/updateOwner", controller.UpdateOwner);
router.get("/", controller.readAll);

module.exports = router;
