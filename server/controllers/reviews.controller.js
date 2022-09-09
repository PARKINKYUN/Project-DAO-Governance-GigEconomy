const reviewmodel = require("../models/review.model"); // 외부 모듈 가져오기, 파라미터로 추가할 모듈의 파일 경로값을 받음
const jwt = require("jsonwebtoken"); // 클라이언트와 서버 사이 통신시 권한을 인가하기 위해 사용하는 토큰

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
        // accessToken 콘솔 찍어서 구조를 보고 수정해야함
        // console.log(accessToken);
        const token = accessToken.split(" ")[0]; //split(") [0] token만 가져온다.
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const latestreview = await reviewmodel.getLatestReviewId();
          const review_number = latestreview[0].review_id;

          const newReview = {
            // review.model의 newReview 같아도 되는지,,
            review_id: review_number + 1,
            client_id: req.body.client_id,
            worker_id: req.body.worker_id,
            content: req.body.content,
          };
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
  reviewlistbyorder: async (req, res) => {
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
          const reviewInfo = reviewmodel.getReviewByorderId(req.body.order_id);
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
          const reviewInfo = reviewmodel.getReviewByworkerId(
            req.body.worker_id
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
          const updatereview = await reviewmodel.findOneAndUpdate(
            req.body.review_id,
            req.body.content,
            req.body.new
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
          const deletereview = await reviewmodel.findByIdAndRemove(
            req.body.review_id,
            req.body.content,
            req.body.new
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
};
