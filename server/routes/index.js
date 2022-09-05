const express = require("express");
const router = express.Router();

const main = require("./main");
const users = require("./users");

router.use("/users", users);
router.use("/", main);

module.exports = router;