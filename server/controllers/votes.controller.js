const votemodel = require("../models/vote.model");
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
const gigtoken = new web3.eth.Contract(GTabi, GTaddress);
const gigscore = new web3.eth.Contract(GSabi, GSaddress);
const gigmoderator = new web3.eth.Contract(GMabi, GMaddress);

module.exports = {
    vote: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404)
                    .send({ data: null, message: "Not autorized" });
            } else {
                // accessToken 콘솔 찍어서 구조를 보고 수정해야함
                // console.log(accessToken);
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if (!userInfo.isModerator) {
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    // vote 를 위한 트랜잭션 생성작업
                    // 1. 원시 데이터 생성                // 실행 함수 수정해야함
                    const data = contract.methods.vote(ADMIN_WALLET_ACOUNT, userInfo.address, req.body.CHOICEofVOTING).encodeABI();
                    // 2. 원시 트랜잭션 장부 생성
                    const rawTransaction = { to: ADMIN_WALLET_ACOUNT, gas: 1000000, data: data };
                    // 3. 트랜잭션에 개인키(server 개인키)로 서명
                    const signedTX = await web3.eth.accounts.signTransaction(rawTransaction, process.env.ADMIN_WALLET_PRIVATE_KEY);
                    // 4. 서명한 트랜잭션 발송
                    const sendingTX = await web3.eth.sendSignedTransaction(signedTX.rawTransaction);
                    console.log("Vote 전송 트랜잭션: ", sendingTX);

                    res.status(200).send({ data: sendingTX, message: "Transaction success" })
                }
            }
        } catch (err) {
            console.error(err);
            res.status(404).send({ data: null, message: "Can't execute request" })
        }
    },

    voteresult: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404)
                    .send({ data: null, message: "Not autorized" });
            } else {
                // accessToken 콘솔 찍어서 구조를 보고 수정해야함
                // console.log(accessToken);
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if (userInfo.account_type !== "worker") {
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {

                    // 실행 함수 수정해야함
                    const voteResult = await contract.methods.getVoteResult(vote_id).call();

                    res.status(200).send({ data: voteResult, message: "Search completed" })
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
            if(req.body.contract === "GigToken(GST)"){
                contractObj = await new ethers.Contract(GTaddress, GTabi);
                contractAddress = GTaddress;
            } else if(req.body.contract === "GigScore(GSS)"){
                contractObj = await new ethers.Contract(GSaddress, GSabi);
                contractAddress = GSaddress;
            } else if(req.body.contract === "GigModerator(GSM)"){
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
            console.log("생성된 투표의 Id: ", req.body.proposal_id, proposalId);

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
            const data = await governor.methods.propose([contractAddress], req.body.values, [transferCalldata], newDescription).encodeABI();
            const rawTransaction = {to: GovernorAddress, gas: 3000000, data: data};
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


            //
            /***** 각 컨트랙트 액세스 관계 셋팅 *****/
            /***** 주석을 해제하면 정상 작동하는 코드이며, 컨트랙트에 참조된 다른 컨트랙트의 주소를 변경할 수 있으니 신중하게 사용해야 합니다. *****/
            //
            // // 1. GigToken 컨트랙트의 거버너 셋팅
            // const accessData1 = await gigtoken.methods.setGovernor(GovernorAddress).encodeABI();
            // const raw1 = {to: GTaddress, gas: 300000, data: accessData1};
            // const signed1 = await web3.eth.accounts.signTransaction(raw1, process.env.ADMIN_WALLET_PRIVATE_KEY);
            // console.log("여기서 시작", signed1)

            // const sending1 = await web3.eth.sendSignedTransaction(signed1.rawTransaction);
            // console.log("GigToken의 Governor Address 설정이 완료되었습니다.", sending1);
            //
            // // 2. GigScore 컨트랙트의 거버너, 모더레이터 셋팅
            // const accessData2 = await gigscore.methods.setGovernorContractAddress(GovernorAddress).encodeABI();
            // const raw2 = {to: GSaddress, gas: 300000, data: accessData2};
            // const signed2 = await web3.eth.accounts.signTransaction(raw2, process.env.ADMIN_WALLET_PRIVATE_KEY);
            // const sending2 = await web3.eth.sendSignedTransaction(signed2.rawTransaction);
            // console.log("GigScore의 Governor Address 설정이 완료되었습니다.", sending2);
            // const accessData3 = await gigscore.methods.setModeratorContractAddress(GMaddress).encodeABI();
            // const raw3 = {to: GSaddress, gas: 300000, data: accessData3};
            // const signed3 = await web3.eth.accounts.signTransaction(raw3, process.env.ADMIN_WALLET_PRIVATE_KEY);
            // const sending3 = await web3.eth.sendSignedTransaction(signed3.rawTransaction);
            // console.log("GigScore의 Moderator Address 설정이 완료되었습니다.", sending3);
            //
            // // 3. GigModerator 컨트랙트의 거버너, 긱스코어 셋팅
            // const accessData4 = await gigmoderator.methods.setGovernor(GovernorAddress).encodeABI();
            // const raw4 = {to: GMaddress, gas: 300000, data: accessData4};
            // const signed4 = await web3.eth.accounts.signTransaction(raw4, process.env.ADMIN_WALLET_PRIVATE_KEY);
            // const sending4 = await web3.eth.sendSignedTransaction(signed4.rawTransaction);
            // console.log("GigModerator의 Governor Address 설정이 완료되었습니다.", sending4);
            // const accessData5 = await gigmoderator.methods.setToken(GSaddress).encodeABI();
            // const raw5 = {to: GMaddress, gas: 300000, data: accessData5};
            // const signed5 = await web3.eth.accounts.signTransaction(raw5, process.env.ADMIN_WALLET_PRIVATE_KEY);
            // const sending5 = await web3.eth.sendSignedTransaction(signed5.rawTransaction);
            // console.log("GigModerator의 GigScore Address 설정이 완료되었습니다.", sending5);

            return res.status(200).send({ data: changeStatus, message: "Created new propose obj" })
        } catch (err) {
            console.log("Error...")
            res.status(400).send({
                data: null,
                message: "Can't run propose function",
            });
        }
    },
}