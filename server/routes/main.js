const express = require("express");
const router = express.Router();
const controller = require("../controllers/main")

router.get("/", controller.findAll); //메인 화면

module.exports = router;