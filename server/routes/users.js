const express = require("express");
const router = express.Router();
const controller = require("../controllers/users");

router.post("/login", controller.login);
router.post("/join", controller.join);
router.get("/info", controller.info);
router.patch("/updateInfo", controller.updateInfo);

module.exports = router;

