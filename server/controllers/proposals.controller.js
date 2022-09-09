const proposalModel = require("../models/proposal.model");

module.exports = {
  // pending 상태 제안 리스트
  getPendingProposals: async () => {
    try {
      const proposals = await proposalModel.getProposals("pending");
      if (!proposals) {
        return res.status(400).message("제안 리스트를 불러오지 못했습니다.");
      }
      return res
        .status(200)
        .send({ data: proposals, message: "제안 리스트를 불러왔습니다." });
    } catch (err) {
      console.error(err);
      return res.status(400);
    }
  },

  // voting 상태 제안 리스트
  getVotingProposals: async () => {
    try {
      const proposals = await proposalModel.getProposals("voting");
      if (!proposals) {
        return res.status(400).message("제안 리스트를 불러오지 못했습니다.");
      }
      return res.status(200).send({
        data: proposals,
        message: "투표 중인 제안 리스트를 불러왔습니다.",
      });
    } catch (err) {
      console.error(err);
      return res.status(400);
    }
  },

  // concluded 상태 제안 리스트
  getConcludedProposals: async () => {
    try {
      const proposals = await proposalModel.getProposals("concluded");
      if (!proposals) {
        return res.status(400).message("제안 리스트를 불러오지 못했습니다.");
      }
      return res.status(200).send({
        data: proposals,
        message: "투표가 끝난 제안 리스트를 불러왔습니다.",
      });
    } catch (err) {
      console.error(err);
      return res.status(400);
    }
  },

  // 제안 올리기
  postProposal: async () => {
    try {
      modCheck(res, req);

      const proposal = await proposalModel.newProposal(req.body);
      if (!proposal) {
        return res.status(400).message("제안을 올리지 못했습니다.");
      }

      return res
        .status(200)
        .send({ data: proposal._id, message: "제안을 올렸습니다." });
    } catch (err) {
      console.error(err);
      return res.status(400);
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
};

// 관리자 권한 체크
const modCheck = async (req, res) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) {
    return res
      .status(404)
      .send({ data: null, message: "Invalid access token" });
  }

  const workerData = jwt.verify(accessToken, process.env.ACCESS_SECRET);
  if (workerData.mod_authority == false) {
    return res.status(400).message("관리자 권한이 필요합니다.");
  }
  if (workerData.mod_authority == true) return;
};
