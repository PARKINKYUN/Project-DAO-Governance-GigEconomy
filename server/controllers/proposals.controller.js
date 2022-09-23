const proposalModel = require("../models/proposal.model");
const proposalSelector = require("../models/proposalSelector.model");
const jwt = require("jsonwebtoken");

const Web3 = require("web3");
const { ethers } = require("ethers");

const GTabi = require("../contracts/GTabi"); // Gig Token ABI
const GTaddress = require("../contracts/GTaddress"); // Gig Token Address

const GSabi = require("../contracts/GSabi"); // Gig Score ABI
const GSaddress = require("../contracts/GSaddress"); // Gig Score Address

const GMabi = require("../contracts/GMabi"); // Moderator ABI
const GMaddress = require("../contracts/GMaddress"); // Moderator Address

const GovernorABI = require("../contracts/GovernorABI"); // Governor ABI
const GovernorAddress = require("../contracts/GovernorAddress"); // Governor Address

const web3 = new Web3(process.env.RPCURL);
const governor = new web3.eth.Contract(GovernorABI, GovernorAddress);

module.exports = {
  // 진행중인 제안 리스트
  getOnPostProposals: async (req, res) => {
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
          const proposalInfo = await proposalModel.getOnPostProposals();

          return res.status(200).send({ data: proposalInfo, message: "Searching success" })
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
        return res
          .status(404)
          .send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const proposalInfo = await proposalModel.successfulProposal(req.body.proposal_id);
          console.log("해당 제안이 성공하여 잠시 대기 중입니다.", proposalInfo)

          return res.status(200).send({ data: proposalInfo, message: "Searching success" })
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
    proposedProposal: async (req, res) => {
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
            const proposalInfo = await proposalModel.proposedProposal(req.body.proposal_id);
            console.log("해당 제안이 propose 함수를 실행하여 대기열에서 사라집니다.", proposalInfo)
  
            return res.status(200).send({ data: proposalInfo, message: "Searching success" })
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

  // 기간 만료된 제안의 상태 변경
  expiredProposal: async (req, res) => {
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
          const proposalInfo = await proposalModel.expiredProposal(req.body.proposal_id);
          console.log("해당 제안이 더이상 노출되지 않습니다.", proposalInfo)

          return res.status(200).send({ data: proposalInfo, message: "Searching success" })
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
          const proposalInfo = await proposalModel.upCount(req.body.proposal_id);
          const selector = await proposalSelector.saveSeletor({ proposal_id: req.body.proposal_id, worker_id: userInfo.worker_id });
          console.log("해당 제안의 up count가 1 증가하였습니다.", proposalInfo)

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
          const proposalInfo = await proposalModel.downCount(req.body.proposal_id);
          const selector = await proposalSelector.saveSeletor({ proposal_id: req.body.proposal_id, worker_id: userInfo.worker_id });
          console.log("해당 제안의 down count가 1 증가하였습니다.", proposalInfo)

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

  // worker가 해당 proposal에 이미 선택을 했는지 여부 반환
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
          const selector = await proposalSelector.checkSelector({ proposal_id: req.params.proposal_id, worker_id: userInfo.worker_id });
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

  // 제안 올리기
  postProposal: async (req, res) => {
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
          const latestProposal = await proposalModel.getLatestProposalId();
          const proposal_number = latestProposal[0].proposal_id;

          const newProposal = {
            proposal_id: proposal_number + 1,
            title: req.body.title,
            content: req.body.content,
            worker_id: userInfo.worker_id,
          };
          const inputData = await proposalModel.saveProposal(newProposal)
          console.log("Wow! 새로운 제안이 저장되었습니다.", inputData);

          return res.status(200).send({ data: inputData, message: "Created new proposal" })
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

  // 사이트에서 1차로 통과된 제안에 대해
  // governor 컨트랙트의 propose 함수 실행시키는 로직
  propose: async (req, res) => {
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

          //
          /* Gig Token 을 핸들링하는 제안인 경우 */
          //

          const currState = await governor.methods.state("41396008272626761976333970890805314422531695687300321995538584730435024288873").call();
          console.log("state의 상태", currState)
          

          // call data 생성
          const gt = await new ethers.Contract(GTaddress, GTabi);

          const senderAddress = process.env.ADMIN_WALLET_ACOUNT;
          const receipientAddress = "0xd5682142400b484Cb4E6af761A3e5fb534013C04";
          const transAmount = 1000000;
          const transferCalldata = gt.interface.encodeFunctionData("transferFrom", [senderAddress, receipientAddress, transAmount]);
          console.log("propose call data: ", transferCalldata);

          // Governor propose 호출 트랜잭션 생성
          
          const data = governor.methods.propose([GTaddress], [0], [transferCalldata], "propose test").encodeABI();
          const rawTransaction = {to: GovernorAddress, gas: 30000000, data: data};
          const signedTX = await web3.eth.accounts.signTransaction(rawTransaction, process.env.ADMIN_WALLET_PRIVATE_KEY);
          console.log(signedTX.transactionHash)
          const sendingTX = await web3.eth.sendSignedTransaction(signedTX.rawTransaction);
          console.log("sending TX. 트랜잭션 전송 완료", sendingTX);

          //
          /* Gig Score 를 핸들링하는 제안인 경우 */
          //

          //
          /* Moderator 를 핸들링하는 제안인 경우 */
          //

          return res.status(200).send({ data: inputData, sendingTX: "Created new propose obj" })
        }
      }
    } catch (err) {
      console.log("또 에러...")
      res.status(400).send({
        data: null,
        message: "Can't run propose function",
      });
    }
  }
};


