const express = require("express");
const controller = require("../Controller/AdminController");
const router = express.Router();

router.post("/admin", controller.CreateAdmin);
router.post("/login", controller.LoginAdmin);

module.exports = router;
