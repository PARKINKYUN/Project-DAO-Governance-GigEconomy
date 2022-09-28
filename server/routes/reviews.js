const express = require("express");
const router = express.Router();
const controller = require("../controllers/reviews.controller");

router.post("/review", controller.newreview); //리뷰 추가
router.get("/reviewlistbyworker/:worker_id", controller.reviewsListByWorker); //리뷰 조회
router.delete("/deletereview", controller.deletereview); //리뷰 삭제
router.patch("/updatereview", controller.updatereview); //리뷰 수정
router.get("/reviews/recentReview", controller.recentReview); // 메인페이지용. 최근 리뷰 조회

module.exports = router;
