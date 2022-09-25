const clientModel = require("../models/client.model");
const workerModel = require("../models/worker.model");

const jwt = require("jsonwebtoken");

const Web3 = require("web3");

// infura를 web3 프로바이더로 사용함
const web3 = new Web3(process.env.RPCURL);
///////////// const contract = new web3.eth.Contract(contract_abi, contract_address);

// 최초 회원 가입 시 지급하는 토큰의 양
const welcomeReward = 100000;
// Access Token 만료 주기
const expiresIn = "1d";

module.exports = {
  // 회원 로그인
  login: async (req, res) => {
    try {
      const clientInfo = await clientModel.getClientInfoById(
        req.body.client_id
      );
      if (!clientInfo.length) {
        return res.status(400).send({ data: null, message: "Not autorized" });
      } else {
        const checkClientInputData = await clientModel.checkPassword(
          req.body.client_id,
          req.body.password
        );

        if (!checkClientInputData) {
          return res.status(400).send({ data: null, message: "Not autorized" });
        } else {
          // client가 소유한 최신 토큰 정보를 블록체인 네트워크에서 읽어와 업데이트
          /////// const balance = await contract.methods.balanceOf(clientInfo[0].address).call();

          // const updateBalance = await clientModel.setTokenById(
          //     clientInfo[0].client_id,
          //     balance
          // );

          // console.log("DB 업데이트된 Token의 양: ", updateBalance.balance);

          // client 정보 객체를 만들어 토큰에 담아 응답
          const clientData = {
            client_id: clientInfo[0].client_id,
            account_type: clientInfo[0].account_type,
            nickname: clientInfo[0].nickname,
            address: clientInfo[0].address,
            image: clientInfo[0].image,
            introduction: clientInfo[0].introduction,
          };

          const accessToken = jwt.sign(clientData, process.env.ACCESS_SECRET, {
            expiresIn: expiresIn,
          });

          console.log("accessToken: ", accessToken);

          return res.status(200).send({
            data: {
              accessToken: accessToken,
              clientData: clientData /* balance: updateBalance */,
            },
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
      const inputID = await clientModel.getClientInfoById(req.body.client_id);

      if (inputID.length !== 0) {
        return res
          .status(400)
          .send({ data: null, message: "User ID already exists" });
      }

      const inputNickname = await clientModel.getClientInfoById(
        req.body.nickname
      );

      if (inputNickname.length !== 0) {
        return res
          .status(400)
          .send({ data: null, message: "Nickname already exists" });
      }

      // 입력한 비밀번호로 wallet 계정 생성
      const newAccount = await web3.eth.accounts.create(req.body.password);

      const clientData = {
        client_id: req.body.client_id,
        nickname: req.body.nickname,
        password: req.body.password,
        address: newAccount.address,
        balance: welcomeReward,
      };

      // const createUser = usermodel.saveUser(userData);

      const createUser = await new clientModel(clientData).saveClient();
      console.log("==================", createUser);
      // // 회원가입 보상 토큰 지급을 위한 트랜잭션 생성작업
      // // 1. 원시 데이터 생성
      // const data = contract.methods.transferFrom(ADMIN_WALLET_ACOUNT, clientData.address, welcomeReward).encodeABI();
      const data = gt.methods.rewardWelcome(clientData.address).encodeABI();
      // // 2. 원시 트랜잭션 장부 생성
      // const rawTransaction = {to: ADMIN_WALLET_ACOUNT, gas: 1000000, data: data};
      const rawTransaction = { to: GTaddress, gas: 10000, data: data };
      // // 3. 트랜잭션에 개인키(server 개인키)로 서명
      // const signedTX = await web3.eth.accounts.signTransaction(rawTransaction, process.env.ADMIN_WALLET_PRIVATE_KEY);
      const signedTX = await web3.eth.account.signTransaction(
        rawTransaction,
        process.env.ADMIN_WALLET_PRIVATE_KEY
      );
      // // 4. 서명한 트랜잭션 발송
      // const sendingTX = await web3.eth.sendSignedTransaction(signedTX.rawTransaction);
      const sendingTX = await web3.eth.sendSignedTransaction(
        signedTX,
        rawTransaction
      );
      console.log("Welcome Token 전송 트랜잭션: ", sendingTX);

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
        const clientData = jwt.verify(accessToken, process.env.ACCESS_SECRET);

        console.log("User information: ", clientData);

        // client가 소유한 최신 토큰 정보를 블록체인 네트워크에서 읽어와 업데이트
        const balance = await contract.methods
          .balanceOf(clientData.address)
          .call();
        const updateBalance = await clientModel.setTokenById(
          clientInfo[0].client_id,
          balance
        );
        console.log("DB 업데이트된 Token의 양: ", updateBalance.balance);

        const clientInfo = {
          client_id: clientData.client_id,
          account_type: clientData.account_type,
          nickname: clientData.nickname,
          address: clientData.address,
          balance: balance,
          image: clientData.image,
        };

        return res
          .status(200)
          .send({ data: clientInfo, message: "Completed search" });
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
        const userInfo = jwt.verify(accessToken, process.env.ACCESS_SECRET);

        if (!userInfo) {
          res.status(404).send({ data: null, message: "Invalid account" });
        } else {
          const clientData = await clientModel.getClientInfoById(
            req.body.client_id
          );

          const clientInfo = {
            client_id: clientData.client_id,
            account_type: clientData.account_type,
            nickname: clientData.nickname,
            image: clientData.image,
          };

          return res
            .status(200)
            .send({ data: clientInfo, message: "Completed search" });
        }
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({
        data: null,
        message: "Can't execute request",
      });
    }
  },

  // 회원정보 수정
  updateClientInfo: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res
          .status(404)
          .send({ data: null, message: "Invalid access token" });
      } else {
        const clientData = jwt.verify(accessToken, process.env.ACCESS_SECRET);

        if (clientData.account_type !== "client") {
          res.status(404).send({ data: null, message: "Invalid account" });
        } else {
          const updateInfo = await clientModel.setClientInfo(
            clientData.client_id,
            req.body.image[0],
            req.file.filename,
            req.body.image[1]
          );

          res
            .status(200)
            .send({ data: req.file.filename, message: "Client info updated" });
        }
      }
    } catch (err) {
      console.error(err);
      res.status(404).send({ data: null, message: "Can't execute request" });
    }
  },

  // 아이디, 닉네임 중복 여부 확인
  checkInpuData: async (req, res) => {
    try {
      const checkClient = await clientModel.checkInputData(
        req.body.email,
        req.body.nickname
      );
      const checkWorker = await workerModel.checkInputData(
        req.body.email,
        req.body.nickname
      );

      if (checkClient && checkWorker) {
        return res.status(200).send({ data: true, message: "ok" });
      }
      return res.status(200).send({ data: false, message: "Already Exist!" });
    } catch (err) {
      console.error(err);
      res.status(404).send({ data: null, message: "Can't execute request" });
    }
  },

  // 아이디, 비밀번호 일치여부 확인
  checkNickname: async (req, res) => {
    try {
      const checkClient = await clientModel.checkNickname(req.body.nickname);
      const checkWorker = await workerModel.checkNickname(req.body.nickname);

      if (checkClient && checkWorker) {
        return res.status(200).send({ data: true, message: "ok" });
      }
      return res.status(200).send({ data: false, message: "Already Exist!" });
    } catch (err) {
      console.error(err);
      res.status(404).send({ data: null, message: "Can't execute request" });
    }
  },
};
