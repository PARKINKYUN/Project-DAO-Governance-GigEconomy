const express = require("express");
const router = express.Router();
const controller = require("../controllers/estimate.controller");

router.post("/newEstimation", controller.newEstimation);
router.get("/getResultByWorker", controller.getResultByWorker);
router.get("/isTryable/:extimate_id", controller.isTryable);
router.delete("/deleteEstimation", controller.deleteEstimation);

module.exports = router;