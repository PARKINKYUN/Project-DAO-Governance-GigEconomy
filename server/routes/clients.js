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
router.get("/myinfo", controller.myInfo); //회원정보
router.get("/clientinfo", controller.clientInfo); //다른 유저 정보 조회
router.patch("/updateclientinfo", uploads.single("image"), controller.updateClientInfo);

module.exports = router;
