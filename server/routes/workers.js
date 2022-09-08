const express = require("express");
const router = express.Router();
const controller = require("../controllers/workers.controller");

router.get("/", controller.workerList); // pending 상태인 워커 리스트

module.exports = router;
