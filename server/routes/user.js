const express = require("express");
const router = express.Router();
const controller = require("../controllers/users");

router.post("/join", controller.join); //회원가입
router.post("/login", controller.login); //로그인
router.get("/myinfo", controller.myinfo); //회원정보
router.get("/:id", controller.id); //다른 유저 정보 조회
router.patch("/myinfo/add_worker_info", controller.myinfo); //워커 정보 입력
router.patch("/myinfo/change_worker_info", controller.myinfo); //워커 정보 입력

module.exports = router;
