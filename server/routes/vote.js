const express = require("express");
const router = express.Router();
const controller = require("../controllers/vote");

router.post("/vote", controller.vote); //투표
router.get("/voteresult", controller.voteresult); //조회

module.exports = router;
