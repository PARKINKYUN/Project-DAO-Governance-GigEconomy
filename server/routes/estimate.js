const express = require("express");
const router = express.Router();
const controller = require("../controllers/estimate.controller");

router.post("/newEstimation", controller.newEstimation);
router.get("/getResultByWorker/:worker_id", controller.getResultByWorker);
router.get("/getEstimationByWorker/:worker_id", controller.getEstimationByWorker);
router.get("/isTryable/:extimate_id", controller.isTryable);
router.get("/getTryingEstimations", controller.getTryingEstimations);
router.delete("/deleteEstimation", controller.deleteEstimation);

module.exports = router;