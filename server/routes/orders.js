const express = require("express");
const router = express.Router();
const controller = require("../controllers/order.controller");

router.get("/", controller.getOrderList); // pending 중인 order 리스트
router.get("/order_info/:id", controller.order_info); // order_id로 order 정보 조회
router.get("/getOrderByClient", controller.getOrderByClient); // client_id로 order 정보 조회
router.get("/getOrderByWorker", controller.getOrderByWorker); // worker_id로 order 정보 조회
router.get("/getFinishedOrderByWorker/:worker_id", controller.getFinishedOrderByWorker);
router.patch("/isEstimated/", controller.isEstimated); // order에 평가 반영
router.patch("/isReviewed/", controller.isReviewed); // order에 대한 리뷰 저장
router.post("/direct_order/:id", controller.direct_order); //워커에게 직접 의뢰하기(private)
router.post("/new_order", controller.new_order); //findOrder 페이지에 표시되는 오더(public)

// status pending only
router.patch("/order_info/:id/edit", controller.edit_order); //오더 내용 변경. 사용하지 않음!
router.patch("/order_info/:id/make_offer", controller.make_offer); //워커가 pending 상태인 오더에 제안 등록
router.patch("/order_info/beginwork", controller.beginwork); //오더 시작
router.delete("/order_info/remove", controller.remove); //오더 삭제

// status ongoing only
router.patch("/order_info/extend", controller.extend); //오더 연장
router.patch("/order_info/cancel", controller.cancel); //오더 취소. 사용하지 않음!
router.patch("/order_info/finish", controller.finish); //오더 완료

module.exports = router;
