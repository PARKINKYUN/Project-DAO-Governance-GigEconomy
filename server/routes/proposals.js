const express = require("express");
const router = express.Router();
const controller = require("../controllers/proposals.controller");

router.post("/proposal", controller.proposal); //제안 추가
router.get("/proposallist", controlloer.proposallist); //제안 조회
router.delete("/deleteproposal", controller.deleteproposal); //제안 삭제
router.patch("/updateproposal", controller.updateproposal); //제안 수정
module.exports = router;

//모더레이트가 되면 정책에 대한 제안을 올릴 수 있다.