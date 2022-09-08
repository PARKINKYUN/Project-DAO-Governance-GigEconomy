const workerModel = require("../models/worker.model");
const orderModel = require("../models/order.model");

const jwt = require("jsonwebtoken");

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

        if (!checkUserInputData) {
          return res.status(400).send({ data: null, message: "Not autorized" });
        } else {
          // client가 소유한 최신 토큰 정보를 블록체인 네트워크에서 읽어와 업데이트
          const balance = await contract.methods
            .balanceOf(workerInfo[0].address)
            .call();

          const updateBalance = await workerModel.setTokenById(
            workerInfo[0].worker_id,
            balance
          );

          console.log("DB 업데이트된 Token의 양: ", updateBalance.balance);

          // worker 정보 객체를 만들어 토큰에 담아 응답
          const workerData = {
            worker_id: workerInfo[0].worker_id,
            nickname: workerInfo[0].nickname,
            address: workerInfo[0].address,
            image: workerInfo[0].image,
          };

          const accessToken = jwt.sign(workerData, process.env.ACCESS_SECRET, {
            expiresIn: expiresIn,
          });

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
        image: req.file.path,
        address: newAccount.address,
        balance: welcomeReward,
      };

      // const createUser = usermodel.saveUser(userData);

      const createUser = await new workerModel(workerData).saveUser();

      // 회원가입 보상 토큰 지급을 위한 트랜잭션 생성작업
      // 1. 원시 데이터 생성
      const data = contract.methods
        .transferFrom(ADMIN_WALLET_ACOUNT, workerData.address, welcomeReward)
        .encodeABI();

      // 2. 원시 트랜잭션 장부 생성
      const rawTransaction = {
        to: ADMIN_WALLET_ACOUNT,
        gas: 1000000,
        data: data,
      };

      // 3. 트랜잭션에 개인키(server 개인키)로 서명
      const signedTX = await web3.eth.accounts.signTransaction(
        rawTransaction,
        process.env.ADMIN_WALLET_PRIVATE_KEY
      );

      // 4. 서명한 트랜잭션 발송
      const sendingTX = await web3.eth.sendSignedTransaction(
        signedTX.rawTransaction
      );
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
        const workerData = jwt.verify(accessToken, process.env.ACCESS_SECRET);

        console.log("User information: ", workerData);

        // client가 소유한 최신 토큰 정보를 블록체인 네트워크에서 읽어와 업데이트
        const balance = await contract.methods
          .balanceOf(workerData.address)
          .call();
        const updateBalance = await workerModel.setTokenById(
          workerInfo[0].worker_id,
          balance
        );
        console.log("DB 업데이트된 Token의 양: ", updateBalance.balance);

        const workerInfo = {
          worker_id: workerData.worker_id,
          nickname: workerData.nickname,
          address: workerData.address,
          balance: balance,
          image: workerData.image,
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

        console.log("User information: ", userInfo);

        const workerInfo = null;
        // 특정 사용자의 정보 조회
        // 다른 models가 구현되어야 코딩 가능함
        //
        //
        // 작성 필요
        //
        //
        //

        return res.status(200).send({
          data: workerInfo,
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

  // 워커의 pending 상태 전환(true || false)
  toggleStatus: async () => {
    try {
      const workerId = getWorkerId(res, req);

      const worker = await workerModel.togglePending(workerId);
      if (!worker) {
        return res.status(400).message("pending 리스트 등록에 실패했습니다.");
      }

      if (worker.pending == true) {
        // 블록체인과 연결하여 token을 deposit하는 등의 로직
        return res.status(200).message("pending 리스트에 등록되었습니다.");
      }

      if (worker.pending == false) {
        // 블록체인과 연결하여 token을 deposit하는 등의 로직
        return res.status(200).message("더 이상 오더를 받지 않습니다.");
      }
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

  // requested 상태의 오더 리스트(client가 worker에게 직접 보낸 order)
  listRequested: async () => {
    try {
      const workerId = getWorkerId(res.req);

      const requestedOrders = await orderModel.requestedOrdersById(
        "worker",
        workerId
      );
      if (!requestedOrders) {
        return res.status(400).message("오더를 불러오지 못했습니다.");
      }

      return res.status(200).send({
        data: pendingOrders,
        message: "클라이언트가 직접 의뢰한 오더를 불러왔습니다.",
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
};

const getWorkerId = (req, res) => {
  const accessToken = req.headers.authorization;
  if (!accessToken) {
    return res
      .status(404)
      .send({ data: null, message: "Invalid access token" });
  }

  const workerData = jwt.verify(accessToken, process.env.ACCESS_SECRET);
  if (workerData.account_type !== "worker") {
    return res.status(404).message("worker only");
  }

  return workerData.worker_id;
};
