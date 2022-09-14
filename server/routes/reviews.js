const express = require("express");
const router = express.Router();
const controller = require("../controllers/reviews.controller");

router.post("/review", controller.newreview); //리뷰 추가
router.get("/reviewlistbyorder", controller.reviewlistbyorder); //리뷰 조회
router.get("/reviewlistbyworker", controller.reviewlistbyworker); //리뷰 조회
router.delete("/deletereview", controller.deletereview); //리뷰 삭제
router.patch("/updatereview", controller.updatereview); //리뷰 수정

module.exports = router;
