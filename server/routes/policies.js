const express = require("express");
const router = express.Router();
const controller = require("../controllers/policies.controller");

router.get("/", controller.getPolicies); // 전체 정책 읽어오기
router.post("/newpolicy", controller.saveNewpolicy); // 투표에 통과한 새로운 정책 저장하기

module.exports = router;