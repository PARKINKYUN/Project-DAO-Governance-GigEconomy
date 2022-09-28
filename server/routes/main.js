const express = require("express");
const router = express.Router();
const controller = require("../controllers/main.controller")

router.get("/", controller.getRecentReviews); //메인 화면

module.exports = router;