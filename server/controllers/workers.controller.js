const workerModel = require("../models/worker.model");

const jwt = require("jsonwebtoken");

module.exports = {
  // pending 상태의 워커 리스트
  workerList: async () => {
    try {
      const workerList = await workerModel.getPendingWorker();
      if (!workerList) {
        return res
          .status(400)
          .message("워커 리스트를 불러오는데 실패했습니다.");
      }

      return res
        .status(200)
        .send({ data: workerList, message: "워커 리스트를 불러왔습니다." });
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  },
};
