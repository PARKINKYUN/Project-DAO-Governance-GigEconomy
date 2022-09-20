const express = require("express");
const router = express.Router();
const controller = require("../controllers/workers.controller");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: "uploads/",
});
const uploads = multer({ storage: storage });

router.get("/", controller.workerList); // pending 상태인 워커 리스트
router.post("/join", controller.join); // 회원가입
router.post("/login", controller.login); // 로그인
router.get("/myInfo", controller.myInfo); // 회원정보
router.get("/worker_info/:id", controller.workerInfo); // 워커 정보
router.patch("/updateinfo", uploads.single("image"), controller.updateWorkerInfo); // 워커 회원정보 변경

router.patch("/toggle_status", controller.toggleStatus); // 워커의 pending 상태 전환(true || false)
router.get("/myOrder/pending", controller.listPending); // pending 상태의 오더 리스트
router.get("/myOrder/in_progress", controller.listInProgress); // ongoing, extended 상태의 order 리스트
router.get("/myOrder/past_orders", controller.listPastOrders); // finished, canceled 상태의 order 리스트
module.exports = router;
