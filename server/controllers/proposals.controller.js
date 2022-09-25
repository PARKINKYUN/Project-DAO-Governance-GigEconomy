const proposalModel = require("../models/proposal.model");
const proposalSelector = require("../models/proposalSelector.model");
const transactionmodel = require("../models/transactions.model");
const jwt = require("jsonwebtoken");

module.exports = {
  // 진행중인 제안 리스트
  getOnPostProposals: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res.status(404).send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const proposalInfo = await proposalModel.getOnPostProposals();

          return res
            .status(200)
            .send({ data: proposalInfo, message: "Searching success" });
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

  // 정족수에 도달하여 성공한 제안의 상태 변경
  successfulProposal: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res.status(404).send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          console.log("======req.body======", req.body)
          const proposalInfo = await proposalModel.successfulProposal(
            req.body.proposal_id
          );
          console.log("해당 제안이 성공하여 잠시 대기 중입니다.", proposalInfo);

          return res
            .status(200)
            .send({ data: proposalInfo, message: "Searching success" });
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

  // 성공하여 투표를 대기하고 있던 제안의 상태변경
  proposedProposal: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res.status(404).send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const proposalInfo = await proposalModel.proposedProposal(
            req.body.proposal_id
          );
          console.log(
            "해당 제안이 propose 함수를 실행하여 대기열에서 사라집니다.",
            proposalInfo
          );

          return res
            .status(200)
            .send({ data: proposalInfo, message: "Searching success" });
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

  // standBy
  getStandByProposals: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;
      console.log("sdfsdfsdfdsfdsfsdfdsfsf");

      if (!accessToken) {
        return res.status(404).send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const proposalInfo = await proposalModel.getStandByProposals();
          console.log(
            "해당 제안이 propose 함수를 실행하여 대기열에서 사라집니다.",
            proposalInfo
          );

          return res
            .status(200)
            .send({ data: proposalInfo, message: "Searching success" });
        }
      }
    } catch (err) {
      res.status(400).send({
        data: null,
        message: "Can't search",
      });
    }
  },

  // 기간 만료된 제안의 상태 변경
  expiredProposal: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res.status(404).send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const proposalInfo = await proposalModel.expiredProposal(
            req.body.proposal_id
          );
          console.log("해당 제안이 더이상 노출되지 않습니다.", proposalInfo);

          return res
            .status(200)
            .send({ data: proposalInfo, message: "Searching success" });
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
        return res.status(404).send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const proposalInfo = await proposalModel.upCount(
            req.body.proposal_id
          );
          const selector = await proposalSelector.saveSeletor({
            proposal_id: req.body.proposal_id,
            worker_id: userInfo.worker_id,
          });
          console.log("해당 제안의 up count가 1 증가하였습니다.", proposalInfo);

          return res
            .status(200)
            .send({ data: selector, message: "Searching success" });
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
        return res.status(404).send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const proposalInfo = await proposalModel.downCount(
            req.body.proposal_id
          );
          const selector = await proposalSelector.saveSeletor({
            proposal_id: req.body.proposal_id,
            worker_id: userInfo.worker_id,
          });
          console.log(
            "해당 제안의 down count가 1 증가하였습니다.",
            proposalInfo
          );

          return res
            .status(200)
            .send({ data: selector, message: "Searching success" });
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

  // worker가 해당 proposal에 이미 선택을 했는지 여부 반환
  checkSelector: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res.status(404).send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const selector = await proposalSelector.checkSelector({
            proposal_id: req.params.proposal_id,
            worker_id: userInfo.worker_id,
          });
          console.log("worker가 해당 제안을 선택한 횟수", selector);

          return res
            .status(200)
            .send({ data: selector, message: "Searching success" });
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

  // 제안 올리기
  postProposal: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res.status(404).send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const latestProposal = await proposalModel.getLatestProposalId();
          const proposal_number = latestProposal[0].proposal_id;

          const newProposal = {
            proposal_id: proposal_number + 1,
            title: req.body.title,
            content: req.body.content,
            worker_id: userInfo.worker_id,
          };
          const inputData = await proposalModel.saveProposal(newProposal);
          console.log("Wow! 새로운 제안이 저장되었습니다.", inputData);

          return res
            .status(200)
            .send({ data: inputData, message: "Created new proposal" });
        }
      }
    } catch (err) {
      // console.log(err);
      res.status(400).send({
        data: null,
        message: "Can't create new proposal",
      });
    }
  },

  // 제안 조회
  getProposal: async () => {
    try {
      const proposal = await proposalModel.proposalById(req.params.id);
      if (!proposal) {
        return res.status(400).message("제안을 불러오지 못했습니다.");
      }

      return res
        .status(200)
        .send({ data: proposal, message: "제안을 불러왔습니다." });
    } catch (err) {
      console.error(err);
      return res.status(400);
    }
  },

  // 제안 수정
  editProposal: async () => {
    try {
      modCheck(res, req);

      const proposal = await proposalModel.modifyProposal(
        req.params.id,
        req.body
      );
      if (!proposal) {
        return res.status(400).message("제안을 수정하지 못했습니다.");
      }

      return res
        .status(200)
        .send({ data: proposal._id, message: "제안을 수정했습니다." });
    } catch (err) {
      console.error(err);
      return res.status(400);
    }
  },

  // 제안 삭제
  removeProposal: async () => {
    try {
      modCheck(res, req);

      const removeCheck = await proposalModel.deleteProposal(req.params.id);
      if (!removeCheck) {
        return res.status(400).message("제안을 삭제하지 못했습니다.");
      }

      return res.status(200).message("제안을 삭제했습니다.");
    } catch (err) {
      console.error(err);
      return res.status(400);
    }
  },
}
