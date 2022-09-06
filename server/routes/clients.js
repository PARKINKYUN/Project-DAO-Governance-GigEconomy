const express = require("express");
const router = express.Router();
const controller = require("../controllers/users.controller");

router.post("/join", controller.join); //회원가입
router.post("/login", controller.login); //로그인
router.get("/myInfo", controller.myinfo); //회원정보
router.get("/clientInfo", controller.id); //다른 유저 정보 조회

module.exports = router;
