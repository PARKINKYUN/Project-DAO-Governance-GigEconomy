const express = require("express");
const router = express.Router();

const main = require("./main");
const order = require("./order");
const orders = require("./orders");
const proposal = require("./proposal");
const review = require("./review");
const tap = require("./tap");
const user = require("./user");
const vote = vote("./vote");

router.use("/order", order);
router.use("/orders", orders);
router.use("/proposal", proposal);
router.use("/review", review);
router.use("/tap", tap);
router.use("/users", user);
router.use("/vote", vote);
router.use("/", main);

module.exports = router;
