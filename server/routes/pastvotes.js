const express = require("express");
const router = express.Router();
const controller = require("../controllers/votes.controller");

router.get("/votesresult", controller.votesresult); //조회

module.exports = router;