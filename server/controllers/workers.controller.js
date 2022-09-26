const workerModel = require("../models/worker.model");
const orderModel = require("../models/order.model");
const transactionsModel = require("../models/transactions.model")
const GTabi = require("../contracts/GTabi");
const GTaddress = require("../contracts/GTaddress");
const GMabi = require("../contracts/GMabi");
const GMaddress = require("../contracts/GMaddress");
const Web3 = require("web3");

const jwt = require("jsonwebtoken");
const web3 = new Web3(process.env.RPCURL);
const gt = new web3.eth.Contract(GTabi, GTaddress);
const gm = new web3.eth.Contract(GMabi, GMaddress);

// Access Token 만료 주기
const expiresIn = "1d";

module.exports = {
  // 회원 로그인
  login: async (req, res) => {
    try {
      const workerInfo = await workerModel.getWorkerInfoById(
        req.body.worker_id
      );
      if (!workerInfo.length) {
        return res.status(400).send({ data: null, message: "Not autorized" });
      } else {
        const checkWorkerInputData = await workerModel.checkPassword(
          req.body.worker_id,
          req.body.password
        );

        if (!checkWorkerInputData) {
          return res.status(400).send({ data: null, message: "Not autorized" });
        } else {
          // client가 소유한 최신 토큰 정보를 블록체인 네트워크에서 읽어와 업데이트
          // const balance = await contract.methods
          //   .balanceOf(workerInfo[0].address)
          //   .call();

          // const updateBalance = await workerModel.setTokenById(
          //   workerInfo[0].worker_id,
          //   balance
          // );

          // console.log("DB 업데이트된 Token의 양: ", updateBalance.balance);

          // worker 정보 객체를 만들어 토큰에 담아 응답
          const workerData = {
            worker_id: workerInfo[0].worker_id,
            account_type: workerInfo[0].account_type,
            nickname: workerInfo[0].nickname,
            address: workerInfo[0].address,
            image: workerInfo[0].image,
            pending: workerInfo[0].pending,
            mod_authority: workerInfo[0].mod_authority,
            balance: workerInfo[0].balance, ////////////////// 컨트랙트 배포후 수정해야함
            gig_score: workerInfo[0].gig_score, //////////////// 여기도 수정해야함
            introduction: workerInfo[0].introduction,
          };

          const accessToken = jwt.sign(workerData, process.env.ACCESS_SECRET, {
            expiresIn: expiresIn,
          });

          return res.status(200).send({
            data: {
              accessToken: accessToken,
              workerData: workerData /* balance: updateBalance */,
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
      const inputID = await workerModel.getWorkerInfoById(req.body.worker_id);

      if (inputID.length !== 0) {
        return res
          .status(400)
          .send({ data: null, message: "User ID already exists" });
      }

      const inputNickname = await workerModel.getWorkerInfoById(
        req.body.nickname
      );

      if (inputNickname.length !== 0) {
        return res
          .status(400)
          .send({ data: null, message: "Nickname already exists" });
      }

      // 입력한 비밀번호로 wallet 계정 생성
      const newAccount = await web3.eth.accounts.create(req.body.password);

      const workerData = {
        worker_id: req.body.worker_id,
        nickname: req.body.nickname,
        password: req.body.password,
        address: newAccount.address,
      };

      const createUser = await new workerModel(workerData).saveWorker();

      // // 회원가입 보상 토큰 지급을 위한 트랜잭션 생성작업
      // // 1. 원시 데이터 생성
      // const data = contract.methods
      //   .transferFrom(ADMIN_WALLET_ACOUNT, workerData.address, welcomeReward)
      //   .encodeABI();
      const data = gt.methods.rewardWelcome(workerData.address).encodeABI();
      // // 2. 원시 트랜잭션 장부 생성
      // const rawTransaction = {
      //   to: ADMIN_WALLET_ACOUNT,
      //   gas: 1000000,
      //   data: data,
      // };

      const rawTransaction = { to: GTaddress, gas: 100000, data: data };

      // // 3. 트랜잭션에 개인키(server 개인키)로 서명
      // const signedTX = await web3.eth.accounts.signTransaction(
      //   rawTransaction,
      //   process.env.ADMIN_WALLET_PRIVATE_KEY
      // );

      const signedTX = await web3.eth.accounts.signTransaction(
        rawTransaction,
        process.env.ADMIN_WALLET_PRIVATE_KEY
      );
      // // 4. 서명한 트랜잭션 발송
      // const sendingTX = await web3.eth.sendSignedTransaction(
      //   signedTX.rawTransaction
      // );
      const sendingTX = await web3.eth.sendSignedTransaction(
        signedTX.rawTransaction
      );

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
        const workerData = jwt.verify(accessToken, process.env.ACCESS_SECRET);

        // client가 소유한 최신 토큰 정보를 블록체인 네트워크에서 읽어와 업데이트
        const balance = await contract.methods
          .balanceOf(workerData.address)
          .call();
        const updateBalance = await workerModel.setTokenById(
          workerInfo[0].worker_id,
          balance
        );

        const workerInfo = {
          worker_id: workerInfo[0].worker_id,
          account_type: workerInfo[0].account_type,
          nickname: workerInfo[0].nickname,
          address: workerInfo[0].address,
          image: workerInfo[0].image,
          pending: workerInfo[0].pending,
          mod_authority: workerInfo[0].mod_authority,
        };

        return res
          .status(200)
          .send({ data: workerInfo, message: "Completed search" });
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
  workerInfo: async (req, res) => {
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
          const workerData = await workerModel.getWorkerInfoById(req.params.id);
          console.log(workerData);
          const workerInfo = {
            worker_id: workerData[0].worker_id,
            account_type: workerData[0].account_type,
            nickname: workerData[0].nickname,
            image: workerData[0].image,
            gig_score: workerData[0].gig_score,
            mod_authority: workerData[0].mod_authority,
          };

          return res
            .status(200)
            .send({ data: workerInfo, message: "Completed search" });
        }

        console.log("User information: ", userInfo);
      }
    } catch (err) {
      console.log(err);
      res.status(400).send({
        data: null,
        message: "Can't execute request",
      });
    }
  },

  // pending 상태의 워커 리스트
  workerList: async (req, res) => {
    try {
      const workerList = await workerModel.getPendingWorker();
      if (!workerList) {
        return res
          .status(400)
          .message("워커 리스트를 불러오는데 실패했습니다.");
      }

      return res
        .status(200)
        .send({ data: workerList, message: "워커 리스트를 불러왔습니다." });
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  },

  // 워커의 pending 상태 전환(true || false)
  toggleStatus: async (req, res) => {
    try {
      // 현재 상태가 pending(false) 이면 true 전환하면서 토큰을 지불해야함. 토큰 환불은 하지 않음.
      if (!req.body.currentStatus) {
        //
        // web3 토큰 지불 로직이 들어가야함
        const data = gt.methods.transPending(req.body.address).encodeABI();
        const rawTransaction = { to: GTaddress, gas: 100000, data: data };
        const signedTX = await web3.eth.accounts.signTransaction(
          rawTransaction,
          process.env.ADMIN_WALLET_PRIVATE_KEY
        );
        const sendingTX = await web3.eth.sendSignedTransaction(
          signedTX.rawTransaction
        );
        console.log("Token 전송 트랜잭션: ", sendingTX);
      }
      // pending 수수료 지불한 후 worker의 잔액 확인
      const workerBalance = await gt.methods.balanceOf(req.body.address).call();
      await workerModel.setToken(req.body.address, workerBalance);

      const result = await workerModel.togglePending(req.body.workerId);
      if (!result) {
        return res
          .status(400)
          .send({ data: null, message: "Worker 정보가 없습니다." });
      }

      return res
        .status(200)
        .send({ data: result, message: "pending 리스트에 등록되었습니다." });
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  },

  // pending 상태의 오더 리스트(worker가 offer를 보낸 order)
  listPending: async () => {
    try {
      const workerId = getWorkerId(res.req);

      const pendingOrders = await orderModel.pendingOrdersById(
        "worker",
        workerId
      );
      if (!pendingOrder) {
        return res.status(400).message("오더를 불러오지 못했습니다.");
      }

      return res.status(200).send({
        data: pendingOrders,
        message: "클라이언트에게 제안을 보낸 오더를 불러왔습니다.",
      });
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  },

  // ongoing, extended 상태의 오더 리스트
  listInProgress: async () => {
    try {
      const workerId = getWorkerId(res.req);

      const inProgressOrders = await orderModel.inProgressOrdersById(
        "worker",
        workerId
      );
      if (!inProgressOrders) {
        return res.status(400).message("오더를 불러오지 못했습니다.");
      }

      return res.status(200).send({
        data: inProgressOrders,
        message: "진행중인 오더를 불러왔습니다.",
      });
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  },

  // finished, canceled 상태의 오더 리스트
  listPastOrders: async () => {
    try {
      const workerId = getWorkerId(res.req);

      const pastOrders = await orderModel.pastOrdersById("worker", workerId);
      if (!pastOrder) {
        return res.status(400).message("오더를 불러오지 못했습니다.");
      }

      return res.status(200).send({
        data: pastOrders,
        message: "pending 상태의 오더를 불러왔습니다.",
      });
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  },

  // 회원 정보 변경
  updateWorkerInfo: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res
          .status(404)
          .send({ data: null, message: "Invalid access token" });
      } else {
        const workerData = jwt.verify(accessToken, process.env.ACCESS_SECRET);

        if (workerData.account_type !== "worker") {
          res.status(404).send({ data: null, message: "Invalid account" });
        } else {
          const updateInfo = await workerModel.setWorkerInfo(
            workerData.worker_id,
            req.body.image[0],
            req.file.filename,
            req.body.image[1]
          );

          res
            .status(200)
            .send({ data: req.file.filename, message: "Worker info updated" });
        }
      }
    } catch (err) {
      console.error(err);
      res.status(404).send({ data: null, message: "Can't execute request" });
    }
  },

  moderator: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res
          .status(404)
          .send({ data: null, message: "Invalid access token" });
      } else {
        const workerData = jwt.verify(accessToken, process.env.ACCESS_SECRET);

        if (workerData.account_type !== "worker") {
          res.status(404).send({ data: null, message: "Invalid account" });
        } else {
          // 1. 블록체인 상에서 모더레이터 NFT 발급
          const data = gm.methods.safeMint(workerData.address).encodeABI();
          const rawTransaction = { to: GMaddress, gas: 1000000, data: data };
          const signedTX = await web3.eth.accounts.signTransaction(
            rawTransaction,
            process.env.ADMIN_WALLET_PRIVATE_KEY
          );
          const sendingTX = await web3.eth.sendSignedTransaction(
            signedTX.rawTransaction
          );

          // 2. DB의 정보 변경
          const mod_author = await workerModel.moderator(workerData.worker_id);

          // 3. 트랜잭션 데이터 DB 저장
          const saveTransaction = await new transactionsModel(
            sendingTX
          ).saveTransaction();
          console.log(
            "모더레이터의 표식! NFT 트랜잭션 정보가 DB에 저장되었습니다.",
            saveTransaction
          );

          res
            .status(200)
            .send({ data: null, message: "Worker info updated" });
        }
      }
    } catch (err) {
      console.error(err);
      res.status(404).send({ data: null, message: "Can't execute request" });
    }
  },
};
