const express = require("express");
const router = express.Router();
const controller = require("../controllers/proposals.controller");

router.get("/proposals/pending", controller.getPendingProposals); // pending제안 리스트
router.get("/proposals/voting", controller.getVotingProposals); // voting 제안 리스트
router.get("/proposals/concluded", controller.getConcludedProposals); // concluded 제안 리스트
router.post("/new_proposal", controller.postProposal); // 제안 올리기
router.get("/proposal/:id", controller.getProposal); // 제안 조회
router.patch("/proposal/:id", controller.editProposal); // 제안 수정
router.delete("/proposal/:id", controller.removeProposal); // 제안 삭제
module.exports = router;

//모더레이트가 되면 정책에 대한 제안을 올릴 수 있다.
