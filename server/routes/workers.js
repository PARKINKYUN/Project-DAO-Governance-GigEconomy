const express = require("express");
const router = express.Router();
const controller = require("../controllers/workers")

router.get("/", controller.getWorkersList); //워커리스트

module.exports = router;