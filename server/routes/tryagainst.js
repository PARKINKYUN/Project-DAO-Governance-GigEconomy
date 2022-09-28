const express = require("express");
const router = express.Router();
const controller = require("../controllers/tryagainst.controller");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/",
});
const uploads = multer({ storage: storage });

router.get("/getOnBoardTry", controller.getOnBoardTry); // 전체 try 리스트
router.post("/newTryAgainst", uploads.single("image"), controller.newTryAgainst); // 새로운 이의제기 올리기
router.get("/checkSelector/:try_id", controller.checkSelector); // 모더레이터가 해당 try에 대한 선택을 이미 했는지 여부 반환
router.patch("/expiredTry", controller.expiredTry); // 기간 만료된 try의 상태 수정
router.patch("/upCount", controller.upCount); // up 클릭 시 숫자 올리기
router.patch("/downCount", controller.downCount); // down 클릭 시 숫자 내리기
router.patch("/successfulTry", controller.successfulTry); // 정족수에 도달하여 성공한 try 등록

module.exports = router;