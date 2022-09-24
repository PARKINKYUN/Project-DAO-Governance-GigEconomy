const express = require("express");
const router = express.Router();
const controller = require("../controllers/votes.controller");

router.post("/vote", controller.vote); //투표하기
router.post("/propose", controller.propose); // 투표 올리기
router.get("/voteresult", controller.voteresult); //조회

module.exports = router;
