const reviewmodel = require("../models/review.model"); // 외부 모듈 가져오기, 파라미터로 추가할 모듈의 파일 경로값을 받음
const workerModel = require("../models/worker.model");

const jwt = require("jsonwebtoken"); // 클라이언트와 서버 사이 통신시 권한을 인가하기 위해 사용하는 토큰

const Web3 = require("web3");
const GTabi = require("../contracts/GTabi");
const GTaddress = require("../contracts/GTaddress");

const web3 = new Web3(process.env.RPCURL);
const gt = new web3.eth.Contract(GTabi, GTaddress);
module.exports = {
  // 리뷰 작성
  newreview: async (req, res) => {
    try {
      const accessToken = req.headers.authorization; //요청 헤더에 토큰을 담아 보냄

      if (!accessToken) {
        return res
          .status(404) //404 에러
          .send({ data: null, message: "Not autorized" }); // 유효하지 않는 데이터와 함께 검증되지 않았다는 메세지를 띄움
      } else {
        const token = accessToken.split(" ")[0]; //split(") [0] token만 가져온다.
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const newReview = {
            order_title: req.body.order_title,
            worker_id: req.body.worker_id,
            order_id: req.body.order_id,
            content: req.body.content,
          };
          //후기 작성 리워드 보상 컨트랙트 작성 필

          const data = gt.methods.rewardReview(userInfo.address).encodeABI();
          const rawTransaction = { to: GTaddress, gas: 1000000, data: data };
          const signedTX = await web3.eth.accounts.signTransaction(
            rawTransaction,
            process.env.ADMIN_WALLET_PRIVATE_KEY
          );
          const sendingTX = await web3.eth.sendSignedTransaction(
            signedTX.rawTransaction
          );
          console.log("Token 전송 트랜잭션: ", sendingTX);

          // 리워드 전송 후 worker 잔액 확인
          const workerBalance = await gt.methods
            .balanceOf(userInfo.address)
            .call();
          await workerModel.setToken(userInfo.address, workerBalance);
          const inputReview = await reviewmodel.saveReview(newReview);
          console.log("똑똑! 새로운 review가 저장되었습니다.", inputReview);

          return res
            .status(200)
            .send({ data: inputReview, message: "Created new review" });
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

  // order_id로 리뷰 조회
  reviewsListByWorker: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res.status(404).send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const reviewInfo = await reviewmodel.getReviewByWorkerId(
            req.params.worker_id
          );
          return res
            .status(200)
            .send({ data: reviewInfo, message: "Searching success" });
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

  // worker_id로 리뷰 조회
  reviewlistbyworker: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res.status(404).send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split("")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const reviewInfo = reviewmodel.getReviewByWorkerId(
            userInfo.worker_id
          );
          return res
            .status(200)
            .send({ data: reviewInfo, message: "Searching success" });
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

  // 리뷰 수정
  updatereview: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res.status(404).send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split("")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const updatereview = await reviewmodel.setReview(
            req.body.review_id,
            req.body.content
          );
          console.log("review 수정이 완료되었습니다.", updatereview);
          return res
            .status(200)
            .send({ data: updatereview, message: "Updating success" });
        }
      }
    } catch (err) {
      // console.log(err);
      res.status(400).send({
        data: null,
        message: "Can't Update review",
      });
    }
  },

  // 리뷰 삭제
  deletereview: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res.status(404).send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split("")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const deletereview = await reviewmodel.removeReview(
            req.body.review_id
          );
          console.log("review 삭제가 완료되었습니다.", deletereview);
          return res
            .status(200)
            .send({ data: deletereview, message: "A review removed" });
        }
      }
    } catch (err) {
      // console.log(err);
      res.status(400).send({
        data: null,
        message: "Can't Update review",
      });
    }
  },

  // 최근 리뷰 조회
  recentReview: async (req, res) => {
    try {
      const recentReview = await reviewmodel.recentReview();
      return res.status(200).send({ data: recentReview, message: "ok" });
    } catch (err) {
      // console.log(err);
      res.status(400).send({
        data: null,
        message: "Can't Update review",
      });
    }
  },
};
