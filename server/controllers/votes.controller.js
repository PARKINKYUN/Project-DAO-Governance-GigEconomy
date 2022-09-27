const votemodel = require("../models/vote.model");
const pastvotemodel = require("../models/pastVote.model");
const transactionsModel = require("../models/transactions.model");
const proposalModel = require("../models/proposal.model");
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
    vote: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404)
                    .send({ data: null, message: "Not autorized" });
            } else {
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if (!userInfo.mod_authority) {
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    // vote 를 위한 트랜잭션 생성작업
                    // 1. 원시 데이터 생성
                    const data = governor.methods.castVote(req.body.proposalId, userInfo.address, req.body.position).encodeABI();
                    // 2. 원시 트랜잭션 장부 생성
                    const rawTransaction = { to: GovernorAddress, gas: 1000000, data: data };
                    // 3. 트랜잭션에 개인키(server 개인키)로 서명
                    const signedTX = await web3.eth.accounts.signTransaction(rawTransaction, process.env.ADMIN_WALLET_PRIVATE_KEY);
                    // 4. 서명한 트랜잭션 발송
                    const sendingTX = await web3.eth.sendSignedTransaction(signedTX.rawTransaction);
                    console.log("Vote 전송 트랜잭션: ", sendingTX);

                    // 트랜잭션 정보를 DB에 저장
                    const saveTransaction = await new transactionsModel(sendingTX).saveTransaction();
                    console.log("투표 트랜잭션 정보가 DB에 저장되었습니다.", saveTransaction)

                    res.status(200).send({ data: saveTransaction, message: "Transaction success" })
                }
            }
        } catch (err) {
            console.error(err);
            res.status(404).send({ data: null, message: "Can't execute request" })
        }
    },

    // 사이트에서 1차로 통과된 제안에 대해
    // governor 컨트랙트의 propose 함수 실행시키는 로직
    propose: async (req, res) => {
        try {
            // calldata 생성
            let contractObj;
            let contractAddress;
            if (req.body.contract === "GigToken(GST)") {
                contractObj = await new ethers.Contract(GTaddress, GTabi);
                contractAddress = GTaddress;
            } else if (req.body.contract === "GigScore(GSS)") {
                contractObj = await new ethers.Contract(GSaddress, GSabi);
                contractAddress = GSaddress;
            } else if (req.body.contract === "GigModerator(GSM)") {
                contractObj = await new ethers.Contract(GMaddress, GMabi);
                contractAddress = GMaddress;
            } else {
                contractObj = await new ethers.Contract(GovernorABI, GovernorAddress);
                contractAddress = GovernorAddress;
            }
            const transferCalldata = contractObj.interface.encodeFunctionData(req.body.methods, req.body.params);

            // Description : 제안에 대한 간단한 설명. 추후 proposalId가 중복 생성되지 않도록 현재 시간을 섞는다.
            const newDescription = "[ " + req.body.description + " ], [ 생성 날짜 : " + Date.now() + " ]";

            // proposalId 생성
            const proposalId = await governor.methods
                .getProposalId([contractAddress], req.body.values, [transferCalldata], newDescription).call();

            // proposal 구조체 객체 생성
            const proposal = {
                proposalId: proposalId,
                proposer_id: req.body.proposer_id,
                proposal_id: req.body.proposal_id,
                targets: [contractAddress],
                values: req.body.values,
                calldatas: [transferCalldata],
                description: newDescription,
                contract: req.body.contract,
                methods: req.body.methods,
                params: req.body.params,
            }

            // Governor propose 호출 트랜잭션 생성
            const data = governor.methods.propose([contractAddress], req.body.values, [transferCalldata], newDescription).encodeABI();
            const rawTransaction = { to: GovernorAddress, gas: 3000000, data: data };
            const signedTX = await web3.eth.accounts.signTransaction(rawTransaction, process.env.ADMIN_WALLET_PRIVATE_KEY);
            const sendingTX = await web3.eth.sendSignedTransaction(signedTX.rawTransaction);

            // 새로운 투표가 생성되었기 때문에 DB에 저장
            const saveVoteData = await new votemodel(proposal).saveVote();
            console.log("새로운 투표가 생성되어 DB에 저장되었습니다.", saveVoteData)

            // 트랜잭션 정보를 DB에 저장
            const saveTransaction = await new transactionsModel(sendingTX).saveTransaction();
            console.log("투표 트랜잭션 정보가 DB에 저장되었습니다.", saveTransaction)

            // 제안의 상태가 standBy => onBallot으로 변경된
            const changeStatus = await proposalModel.proposedProposal(req.body.proposal_id);

            return res.status(200).send({ data: changeStatus, message: "Created new propose obj" })
        } catch (err) {
            console.log("Error...")
            res.status(400).send({
                data: null,
                message: "Can't run propose function",
            });
        }
    },

    getActiveVotes: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404)
                    .send({ data: null, message: "Not autorized" });
            } else {
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if (userInfo.account_type !== "worker") {
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    const activeVotes = await votemodel.getActiveVotes();

                    res.status(200).send({ data: activeVotes, message: "Search completed" })
                }
            }
        } catch (err) {
            console.error(err);
            res.status(404).send({ data: null, message: "Can't execute request" })
        }
    },

    votesresult: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404)
                    .send({ data: null, message: "Not autorized" });
            } else {
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if (userInfo.account_type !== "worker") {
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    const votesResult = await pastvotemodel.getRecentVote();

                    res.status(200).send({ data: votesResult, message: "Search completed" })
                }
            }
        } catch (err) {
            console.error(err);
            res.status(404).send({ data: null, message: "Can't execute request" })
        }
    },

    execute: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404)
                    .send({ data: null, message: "Not autorized" });
            } else {
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if (userInfo.account_type !== "worker") {
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    const targets = req.body.targets;
                    const values = req.body.values;
                    const calldatas = req.body.calldatas;
                    const descriptionHash = await governor.methods.getDescriptionHash(req.body.description).call();

                    // execute 함수 호출 트랜잭션
                    const data = await governor.methods.execute(targets, values, calldatas, descriptionHash).encodeABI();
                    const rawTransaction = { to: GovernorAddress, gas: 5000000, data: data };
                    const signedTX = await web3.eth.accounts.signTransaction(rawTransaction, process.env.ADMIN_WALLET_PRIVATE_KEY);
                    const sendingTX = await web3.eth.sendSignedTransaction(signedTX.rawTransaction);

                    // DB 에 최종 상태 저장
                    const votesResult = await pastvotemodel.finalstatus(req.body.proposalId);

                    // 트랜잭션 정보를 DB에 저장
                    const saveTransaction = await new transactionsModel(sendingTX).saveTransaction();
                    console.log("투표 트랜잭션 정보가 DB에 저장되었습니다.", saveTransaction)

                    res.status(200).send({ data: votesResult, message: "Final step completed" })
                }
            }
        } catch (err) {
            console.error(err);
            res.status(404).send({ data: null, message: "Can't execute request" })
        }
    },
}