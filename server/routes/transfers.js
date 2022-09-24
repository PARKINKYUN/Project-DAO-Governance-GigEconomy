const express = require("express");
const router = express.Router();
const controller = require("../controllers/transfers.controller");

router.post("/user", controller.user); // 사용자 간 토큰 전송
router.patch("/getbalancebyclient", controller.getbalancebyclient); // 클라이언트의 잔액 확인과 업데이트
router.patch("/getbalancebyworker", controller.getbalancebyworker); // 워커의 잔액 확인과 업데이트

module.exports = router;