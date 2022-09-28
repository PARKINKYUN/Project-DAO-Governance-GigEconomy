const express = require("express");
const router = express.Router();
const controller = require("../controllers/offer.controller");

router.get("/offerslistbyorder/:id", controller.offerslistbyorder); // order_id로 offer 정보 조회
router.get("/offerslistbyoffer/:id", controller.offerslistbyoffer); // offer_id로 offer 정보 조회
router.post("/newofferbyorder", controller.newofferbyorder); // order_id에 새로운 offer 등록
router.patch("/updateoffer", controller.updateoffer); // 선택된 오퍼의 상태 변경

module.exports = router;