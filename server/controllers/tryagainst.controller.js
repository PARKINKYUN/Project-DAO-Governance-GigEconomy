const trymodel = require("../models/tryagainst.model");
const tryselector = require("../models/tryselector.model");
const estimate = require("../models/estimate.model");
const jwt = require("jsonwebtoken");

module.exports = {
  // 진행중인 try 리스트
  getOnBoardTry: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        return res
          .status(404)
          .send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const tryInfo = await trymodel.getOnBoardTries();

          return res.status(200).send({ data: tryInfo, message: "Searching success" })
        }
      }
    } catch (err) {
      // console.log(err);
      res.status(400).send({
        data: null,
        message: "Can't search",
      });
    }
  },

  // 정족수에 도달하여 성공한 try의 상태 변경
  successfulTry: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res
          .status(404)
          .send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const tryInfo = await trymodel.successfulTry(req.body.try_id);
          console.log("해당 평가는 더 이상 반영되지 않습니다.", tryInfo)

          return res.status(200).send({ data: tryInfo, message: "Searching success" })
        }
      }
    } catch (err) {
      // console.log(err);
      res.status(400).send({
        data: null,
        message: "Can't search",
      });
    }
  },

  // 기간 만료된 try의 상태 변경
  expiredTry: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res
          .status(404)
          .send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const tryInfo = await trymodel.expiredTry(req.body.try_id);
          console.log("해당 이의 제기가 더이상 노출되지 않습니다.", tryInfo)

          return res.status(200).send({ data: tryInfo, message: "Searching success" })
        }
      }
    } catch (err) {
      // console.log(err);
      res.status(400).send({
        data: null,
        message: "Can't search",
      });
    }
  },

  // up 선택시 정보 변경
  upCount: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res
          .status(404)
          .send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const tryInfo = await trymodel.upCount(req.body.try_id);
          const selector = await tryselector.saveSeletor({try_id: req.body.try_id, worker_id: userInfo.worker_id});
          console.log("해당 제안의 up count가 1 증가하였습니다.", tryInfo)

          return res.status(200).send({ data: selector, message: "Searching success" })
        }
      }
    } catch (err) {
      // console.log(err);
      res.status(400).send({
        data: null,
        message: "Can't search",
      });
    }
  },

  // down 선택시 정보 변경
  downCount: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res
          .status(404)
          .send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const tryInfo = await trymodel.downCount(req.body.try_id);
          const selector = await tryselector.saveSeletor({try_id: req.body.try_id, worker_id: userInfo.worker_id});
          console.log("해당 제안의 down count가 1 증가하였습니다.", tryInfo)

          return res.status(200).send({ data: selector, message: "Searching success" })
        }
      }
    } catch (err) {
      // console.log(err);
      res.status(400).send({
        data: null,
        message: "Can't search",
      });
    }
  },

  // moderator가 해당 try 이의제기에 이미 선택을 했는지 여부 반환
  checkSelector: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res
          .status(404)
          .send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const selector = await tryselector.checkSelector({try_id: req.params.try_id, worker_id: userInfo.worker_id});
          console.log("worker가 해당 제안을 선택한 횟수", selector)

          return res.status(200).send({ data: selector, message: "Searching success" })
        }
      }
    } catch (err) {
      // console.log(err);
      res.status(400).send({
        data: null,
        message: "Can't search",
      });
    }
  },

  // 이의 제기 올리기
  newTryAgainst: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res.status(404).send({ data: null, message: "Invalid access token" });
      } else {
        const workerData = jwt.verify(accessToken, process.env.ACCESS_SECRET);

        if (workerData.account_type !== "worker") {
          res.status(404).send({ data: null, message: "Invalid account" });
        } else {
          const changeEval = await estimate.tryAgainstEstimation(req.body.image[3]);
          const newTry = {
            title: req.body.image[0],
            order_id: req.body.image[2],
            content: req.body.image[1],
            worker_id: workerData.worker_id,
            file: req.file.filename,
          };
          const inputData = await trymodel.newTry(newTry);
          console.log("이의 신청이 등록되었습니다.", inputData);

          return res.status(200).send({ data: inputData, message: "Created new proposal" })
        }
      }
    } catch (err) {
      console.error(err);
      res.status(404).send({ data: null, message: "Can't execute request" })
    }
  },
};