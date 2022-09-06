const token_abi = require("../contracts/contract_abi");
const token_address = require("../contracts/contract_address");
const clientModel = require("../models/client.model");

const jwt = require("jsonwebtoken");

const Web3 = require("web3");

// infura를 web3 프로바이더로 사용함
const web3 = new Web3(process.env.RPCURL);
const contract = new web3.eth.Contract(token_abi, token_address);

// 최초 회원 가입 시 지급하는 토큰의 양
const welcomeReward = 100000;
// Access Token 만료 주기
const expiresIn = "1d";

module.exports = {
    // 회원 로그인
    login: async (req, res) => {
        try {
            const clientInfo = await clientModel.getClientInfoById(req.body.user_id);
            if (!clientInfo.length) {
                return res
                    .status(400)
                    .send({ data: null, message: "Not autorized" });
            } else {
                const checkClientInputData = await clientModel.checkPassword(
                    req.body.user_id,
                    req.body.password
                );

                if (!checkUserInputData) {
                    return res
                        .status(400)
                        .send({ data: null, message: "Not autorized" });
                } else {
                    // client가 소유한 최신 토큰 정보를 블록체인 네트워크에서 읽어와 업데이트
                    const balance = await contract.methods.balanceOf(clientInfo[0].address).call();

                    const updateBalance = await clientModel.setTokenById(
                        clientInfo[0].client_id,
                        balance
                    );

                    console.log("DB 업데이트된 Token의 양: ", updateBalance.balance);

                    // client 정보 객체를 만들어 토큰에 담아 응답
                    const clientData = {
                        client_id: clientInfo[0].client_id,
                        nickname: clientInfo[0].nickname,
                        address: clientInfo[0].address,
                        image: clientInfo[0].image
                    };

                    const accessToken = jwt.sign(
                        clientData,
                        process.env.ACCESS_SECRET,
                        { expiresIn: expiresIn }
                    );

                    console.log("accessToken: ", accessToken);

                    return res.status(200).send({
                        data: { accessToken: accessToken, balance: updateBalance },
                        message: "Logged in",
                    });
                }
            }
        } catch (err) {
            // console.log(err);
            res.status(400).send({
                data: null,
                message: "Can't execute request",
            });
        }
    },

    // 회원가입
    join: async (req, res) => {
        try {
            const inputID = await clientModel.getUserInfoById(req.body.user_id);

            if (inputID.length !== 0) {
                return res
                    .status(400)
                    .send({ data: null, message: "User ID already exists" });
            }

            const inputNickname = await clientModel.getUserInfoById(
                req.body.nickname
            );

            if (inputNickname.length !== 0) {
                return res
                    .status(400)
                    .send({ data: null, message: "Nickname already exists" });
            }

            // 입력한 비밀번호로 wallet 계정 생성
            const newAccount = await web3.eth.accounts.create(
                req.body.password
            );

            const clientData = {
                client_id: req.body.client_id,
                nickname: req.body.nickname,
                password: req.body.password,
                image: null,                  // default image 필요함
                address: newAccount.address,
                balance: 0
            };

            // const createUser = usermodel.saveUser(userData);

            const createUser = await new clientModel(clientData).saveUser();

            // 회원가입 보상 토큰 지급을 위한 트랜잭션 생성작업
            // 1. 원시 데이터 생성
            const data = contract.methods.transferFrom(ADMIN_WALLET_ACOUNT, clientData.address, welcomeReward).encodeABI();

            // 2. 원시 트랜잭션 장부 생성
            const rawTransaction = {to: ADMIN_WALLET_ACOUNT, gas: 1000000, data: data};

            // 3. 트랜잭션에 개인키(server 개인키)로 서명
            const signedTX = await web3.eth.accounts.signTransaction(rawTransaction, process.env.ADMIN_WALLET_PRIVATE_KEY);

            // 4. 서명한 트랜잭션 발송
            const sendingTX = await web3.eth.sendSignedTransaction(signedTX.rawTransaction);
            console.log("20 Token 전송 트랜잭션: ", sendingTX);

            return res.status(200).send({
                data: createUser,
                message: "New User account created!",
            });
        } catch (err) {
            console.log(err);
            res.status(400).send({
                data: null,
                message: "Can't execute request",
            });
        }
    },

    // 나의 정보 조회
    myInfo: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404)
                    .send({ data: null, message: "Invalid access token" });
            } else {
                const clientData = jwt.verify(
                    accessToken,
                    process.env.ACCESS_SECRET
                );

                console.log("User information: ", clientData);

                // client가 소유한 최신 토큰 정보를 블록체인 네트워크에서 읽어와 업데이트
                const balance = await contract.methods.balanceOf(clientData.address).call();
                const updateBalance = await clientModel.setTokenById(
                    clientInfo[0].client_id,
                    balance
                );
                console.log("DB 업데이트된 Token의 양: ", updateBalance.balance);

                const clientInfo = {
                    client_id: clientData.client_id,
                    nickname: clientData.nickname,
                    address: clientData.address,
                    balance: balance,
                    image: clientData.image
                };

                return res.status(200).send({ clientInfo, message: "Completed search" });
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({
                data: null,
                message: "Can't execute request",
            });
        }
    },

    // 특정 사용자 정보 조회
    clientInfo: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404)
                    .send({ data: null, message: "Invalid access token" });
            } else {
                const userInfo = jwt.verify(
                    accessToken,
                    process.env.ACCESS_SECRET
                );

                console.log("User information: ", userInfo);




                const clientInfo = null;
                // 특정 사용자의 정보 조회
                // 다른 models가 구현되어야 코딩 가능함
                //
                //
                // 작성 필요
                //
                //
                //

                
                
                return res.status(200).send({
                    data: clientInfo,
                    message: "Completed search",
                });
            }
        } catch (err) {
            console.log(err);
            res.status(400).send({
                data: null,
                message: "Can't execute request",
            });
        }
    },
};