const clientModel = require("../models/client.model");
const workerModel = require("../models/worker.model");

const jwt = require("jsonwebtoken");

const Web3 = require("web3");
const GTabi = require("../contracts/GTabi");
const GTaddress = require("../contracts/GTaddress");
const GSabi = require("../contracts/GSabi");
const GSaddress = require("../contracts/GSaddress");

const web3 = new Web3(process.env.RPCURL);
const gt = new web3.eth.Contract(GTabi, GTaddress);
const gs = new web3.eth.Contract(GSabi, GSaddress);

module.exports = {
    // 사용자간 토큰 전송
    user: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404) //404 에러
                    .send({ data: null, message: "Not autorized" }); // 유효하지 않는 데이터와 함께 검증되지 않았다는 메세지를 띄움
            } else {
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if (!userInfo) {
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    const sender = userInfo.address;
                    let recipient;
                    let workerFlag;

                    const { userId, userNickname, amount, isWorker } = req.body;
                    if (userId && userNickname === undefined) {
                        const clientInfo = await clientModel.getClientInfoById(userId);
                        const workerInfo = await workerModel.getWorkerInfoById(userId);
                        if (clientInfo.length !== 0) {
                            recipient = clientInfo[0].address;
                            workerFlag = false;
                        } else if (workerInfo.length !== 0) {
                            recipient = workerInfo[0].address;
                            workerFlag = true;
                        } else {
                            return res.status(400).send({data: null, message: "존재하지 않는 ID 또는 Nickname입니다."}) 
                        }
                    } else if (userNickname && userId === undefined) {
                        const clientInfo = await clientModel.getClientInfoByNickname(userNickname);
                        const workerInfo = await workerModel.getWorkerInfoByNickname(userNickname);
                        if (clientInfo.length !== 0) {
                            recipient = clientInfo[0].address;
                            workerFlag = false;
                        } else if (workerInfo.length !== 0) {
                            recipient = workerInfo[0].address;
                            workerFlag = true;
                        } else {
                            return res.status(400).send({data: null, message: "존재하지 않는 ID 또는 Nickname입니다."}) 
                        }
                    } else {
                        return res.status(400).send({data: null, message: "존재하지 않는 ID 또는 Nickname입니다."}) 
                    }

                    // 트랜잭션

                    // 0. sender의 잔액 정보를 가져와 보내는 양 amount와 비교
                    const balance = await gt.methods.balanceOf(sender).call();
                    console.log(sender, "의 잔액: ", balance);
                    
                    if(balance < amount){
                        return res.status(405).send({data: null, message: "잔액이 보내는 양보다 적습니다."})
                    }
                    // 1. 원시 데이터 생성
                    const data = gt.methods.transferFrom(sender, recipient, amount).encodeABI();
                    // 2. 원시 트랜잭션 장부 생성
                    const rawTransaction = {to: GTaddress, gas: 100000, data: data};
                    // 3. 트랜잭션에 개인키(server 개인키)로 서명
                    const signedTX = await web3.eth.accounts.signTransaction(rawTransaction, process.env.ADMIN_WALLET_PRIVATE_KEY);
                    // 4. 서명한 트랜잭션 발송
                    const sendingTX = await web3.eth.sendSignedTransaction(signedTX.rawTransaction);
                    console.log("Token 전송 트랜잭션: ", sendingTX);

                    // 보내는 사람과 받는 사람의 DB 토큰 잔액 업데이트
                    console.log("트랜잭션이 실행되어 DB의 Token 소유자 정보를 업데이트 합니다.")
                    if(isWorker){
                        const workerBalance = await gt.methods.balanceOf(sender).call();
                        await workerModel.setToken(sender, workerBalance);
                    } else {
                        const clientBalance = await gt.methods.balanceOf(sender).call();
                        await clientModel.setToken(sender, clientBalance);
                    }

                    if(workerFlag){
                        const workerBalance = await gt.methods.balanceOf(recipient).call();
                        await workerModel.setToken(recipient, workerBalance);
                    } else {
                        const clientBalance = await gt.methods.balanceOf(recipient).call();
                        await clientModel.setToken(recipient, clientBalance);
                    }

                    return res.status(200).send({ data: null, message: "Transfer success" });
                }
            }
        } catch (err) {
            // console.log(err);
            res.status(400).send({
                data: null,
                message: "Can't create new review",
            });
        }
    },

    getbalancebyclient: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404) //404 에러
                    .send({ data: null, message: "Not autorized" }); // 유효하지 않는 데이터와 함께 검증되지 않았다는 메세지를 띄움
            } else {
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if (!userInfo) {
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    const userAddress = userInfo.address;

                    const balance = await gt.methods.balanceOf(userAddress).call();
                    // worker only : const gigscore = await gs.methods.balanceOf(userAddress).call();

                    const update = await clientModel.setToken(userAddress, balance);
                    console.log("잔액이 업데이트 되었습니다.", update);

                    return res.status(200).send({ data: balance, message: "Searching success" });
                }
            }
        } catch (err) {
            // console.log(err);
            res.status(400).send({
                data: null,
                message: "Can't create new review",
            });
        }
    },

    getbalancebyworker: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404) //404 에러
                    .send({ data: null, message: "Not autorized" }); // 유효하지 않는 데이터와 함께 검증되지 않았다는 메세지를 띄움
            } else {
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if (!userInfo) {
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    console.log("dkfjdkjfd")
                    const userAddress = userInfo.address;

                    const balance = await gt.methods.balanceOf(userAddress).call();
                    const gigscore = await gs.methods.balanceOf(userAddress).call();

                    const update = await workerModel.setToken(userAddress, balance);
                    const update2 = await workerModel.setGigscore(userAddress, gigscore);
                    console.log("잔액이 업데이트 되었습니다.", update, "긱스코어가 업데이트되었습니다.", update2);

                    return res.status(200).send({ data: {balance: balance, gigscore: gigscore}, message: "Searching success" });
                }
            }
        } catch (err) {
            // console.log(err);
            res.status(400).send({
                data: null,
                message: "Can't create new review",
            });
        }
    }
};