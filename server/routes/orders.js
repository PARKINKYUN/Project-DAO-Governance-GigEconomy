const express = require("express");
const router = express.Router();
const controller = require("../controllers/orders");

router.get("/", controller.getOrdersList); //오더 리스트

module.exports = router;