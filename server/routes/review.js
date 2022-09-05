const express = require("express");
const router = express.Router();
const controller = require("../controllers/review");

router.post("/review", controller.post); //리뷰 추가
router.get("/reviewlist", controller.postlist); //리뷰 조회
router.delete("/deletereview", controller.deletpost); //리뷰 삭제
router.patch("/updatereview", controller.updatepost); //리뷰 수정

module.exports = router;
