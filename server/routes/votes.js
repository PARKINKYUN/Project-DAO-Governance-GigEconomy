const express = require("express");
const router = express.Router();
const controller = require("../controllers/votes.controller");

router.post("/vote", controller.vote); //투표하기
router.post("/propose", controller.propose); // 투표 올리기
router.post("/execute", controller.execute); // 성공한 투표 실행
router.get("/getactivevotes", controller.getActiveVotes); // 투표 상태인 vote 자료 가져오기

module.exports = router;
