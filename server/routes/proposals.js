const express = require("express");
const router = express.Router();
const controller = require("../controllers/proposals.controller");

router.get("/getOnPostProposals", controller.getOnPostProposals); // 전체 제안 리스트
router.get("/getStandByProposals", controller.getStandByProposals); // stanby 제안
router.post("/newproposal", controller.postProposal); // 제안 올리기
router.get("/checkSelector/:proposal_id", controller.checkSelector); // 워커가 해당 제안에 대한 선택을 이미 했는지 여부 반환
router.patch("/expiredProposal", controller.expiredProposal); // 기간 만료된 제안의 상태 수정
router.patch("/upCount", controller.upCount); // up 클릭 시 숫자 올리기
router.patch("/downCount", controller.downCount); // down 클릭 시 숫자 내리기
router.patch("/successfulProposal", controller.successfulProposal); // 정족수에 도달하여 성공한 제안 상태변경
router.patch("/proposedProposal", controller.proposedProposal); // 성공한 제안을 propose 함
router.delete("/proposal/:id", controller.removeProposal); // 제안 삭제

module.exports = router;
