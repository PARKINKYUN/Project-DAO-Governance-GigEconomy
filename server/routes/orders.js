const express = require("express");
const router = express.Router();
const controller = require("../controllers/orders.controller");

router.post("/direct_order/:id", controller.direct_order); //워커에게 직접 의뢰하기
router.post("/new_order", controller.new_order); //새로운 오더 생성
router.get("/order_info/:id", controller.order_info); //오더 조회
router.patch("/order_info/:id", controller.order_info); //오더 내용 변경
router.patch("/order_info/:id/start", controller.order_info); //오더 시작
router.patch("/order_info/:id/extend", controller.order_info); //오더 연장
router.patch("/order_info/:id/calcel", contoller.order_info); //오더 취소
router.patch("/order_info/:id/finish", contoller.order_info); //오더 완료
router.get("/", controller.getOrdersList); //오더 리스트

module.exports = router;