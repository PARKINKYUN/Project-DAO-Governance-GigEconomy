const express = require("express");
const router = express.Router();
const controller = require("../controllers/clients.controller");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: "uploads/"
});
const uploads = multer({ storage: storage });

router.post("/join",  controller.join); //회원가입
router.post("/login", controller.login); //로그인
router.post("/checkInpuData", controller.checkInpuData); // client, worker 모두 사용. 아이디/닉네임 일치여부 확인
router.post("/checkNickname", controller.checkNickname); // client, worker 모두 사용. 닉네임 일치여부 확인
router.get("/myinfo", controller.myInfo); //회원정보
router.get("/clientinfo", controller.clientInfo); //다른 유저 정보 조회
router.patch("/updateinfo", uploads.single("image"), controller.updateClientInfo);

module.exports = router;
