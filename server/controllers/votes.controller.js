const contract_abi = require("../contracts/contract_abi");
const contract_address = require("../contracts/contract_address");
const votemodels = require("../models/vote.model");

const Web3 = require(web3);
const jwt = require(jsonwebtoken);

const web3 = new Web3(process.env.RPCURL);
//////// const contract = web3.eth.Contract(contract_abi, contract_address);

mudule.exports = {
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

                if(!userInfo.isModerator){
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    // vote 를 위한 트랜잭션 생성작업
                    // 1. 원시 데이터 생성                // 실행 함수 수정해야함
                    const data = contract.methods.vote(ADMIN_WALLET_ACOUNT, userInfo.address, req.body.CHOICEofVOTING).encodeABI();
                    // 2. 원시 트랜잭션 장부 생성
                    const rawTransaction = {to: ADMIN_WALLET_ACOUNT, gas: 1000000, data: data};
                    // 3. 트랜잭션에 개인키(server 개인키)로 서명
                    const signedTX = await web3.eth.accounts.signTransaction(rawTransaction, process.env.ADMIN_WALLET_PRIVATE_KEY);
                    // 4. 서명한 트랜잭션 발송
                    const sendingTX = await web3.eth.sendSignedTransaction(signedTX.rawTransaction);
                    console.log("Vote 전송 트랜잭션: ", sendingTX);
                    
                    res.status(200).send({ data: sendingTX, message: "Transaction success"})
                }
            }
        } catch (err) {
            console.error(err);
            res.status(404).send({ data: null, message: "Can't execute request"})
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

                if(userInfo.account_type !== "worker"){
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {

                    // 실행 함수 수정해야함
                    const voteResult = await contract.methods.getVoteResult(vote_id).call();
                    
                    res.status(200).send({ data: voteResult, message: "Search completed"})
                }
            }
        } catch (err) {
            console.error(err);
            res.status(404).send({ data: null, message: "Can't execute request"})
        }
    }
}