const express = require("express");
const router = express.Router();

const main = require("./main");
const orders = require("./orders");
const proposals = require("./proposals");
const tryagainst = require("./tryagainst")
const reviews = require("./reviews");
const taps = require("./taps");
const clients = require("./clients");
const votes = require("./votes");
const workers = require("./workers");
const estimate = require("./estimate");
const policies = require("./policies");
const offers = require("./offers");
const transfers = require("./transfers");

router.use("/orders", orders);
router.use("/proposals", proposals);
router.use("/tryagainst", tryagainst);
router.use("/reviews", reviews);
router.use("/taps", taps);
router.use("/clients", clients);
router.use("/votes", votes);
router.use("/workers", workers);
router.use("/estimate", estimate);
router.use("/policies", policies);
router.use("/offers", offers);
router.use("/transfers", transfers);
router.use("/", main);

module.exports = router;
