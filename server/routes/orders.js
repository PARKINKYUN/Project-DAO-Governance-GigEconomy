const express = require("express");
const router = express.Router();
const controller = require("../controllers/orders.controller");

router.get("/", controller.getPendingOrder); // status가 pending인 오더 리스트
router.get("/order_info/:id", controller.order_info); //오더 조회
router.post("/new_order", controller.new_order); //새로운 오더 생성
router.post("/direct_order/:id", controller.direct_order); //워커에게 직접 의뢰하기
router.patch("/order_info/:id/edit", controller.edit_order); //오더 내용 변경
router.patch("/order_info/:id/make-offer", controller.make_offer); //워커가 pending 상태인 오더에 제안 등록
router.patch("/order_info/:id/start", controller.start); //오더 시작
router.patch("/order_info/:id/extend", controller.extend); //오더 연장
router.patch("/order_info/:id/cancel", controller.cancel); //오더 취소
router.patch("/order_info/:id/finish", controller.finish); //오더 완료

module.exports = router;
