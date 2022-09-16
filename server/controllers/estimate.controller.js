const estimatemodel = require("../models/estimate.model"); // 외부 모듈 가져오기, 파라미터로 추가할 모듈의 파일 경로값을 받음
const ordermodel = require("../models/order.model")
const jwt = require("jsonwebtoken"); // 클라이언트와 서버 사이 통신시 권한을 인가하기 위해 사용하는 토큰

module.exports = {
    // 완료된 평가 저장
    newEstimation: async (req, res) => {
        try {
            const accessToken = req.headers.authorization; //요청 헤더에 토큰을 담아 보냄

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
                    const latestEstimation = await estimatemodel.getLatestEstimationId();
                    const estimation_number = latestEstimation[0].estimate_id;

                    const newEstimation = {
                        estimate_id: estimation_number + 1,
                        worker_id: req.body.worker_id,
                        order_id: req.body.order_id,
                        client_id: req.body.client_id,
                        score: req.body.score,
                    };
                    const inputReview = await estimatemodel.saveEstimation(newEstimation);
                    console.log("똑똑! 새로운 review가 저장되었습니다.", inputReview);

                    // order 정보에서 score 업데이트
                    const updateOrder = await ordermodel.updateScore(req.body.order_id, req.body.score);

                    return res
                        .status(200)
                        .send({ data: updateOrder, message: "Created new review" });
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

    // 특정 worker의 총 점수와 평가 갯수, 평균 반환
    getResultByWorker: async (req, res) => {
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
                    const estimationInfo = await estimatemodel.getEstimationByWorker(userInfo.worker_id);

                    const estimatedCount = estimationInfo.length;
                    let sumScore=0;
                    for( let i=0 ; i<estimatedCount ; i++ ){
                        sumScore += estimationInfo[i].score;
                    }

                    const result = {
                        total_score: sumScore,
                        estimation_count: estimatedCount,
                        average_score: sumScore/estimatedCount
                    }

                    return res
                        .status(200)
                        .send({ data: result, message: "Searching success" });
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

    // try 성공한 평가 점수 삭제(order 정보에는 남기고, estimate 정보에서만 삭제한다!)
    deleteEstimation: async (req, res) => {
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
                    const removeData = estimatemodel.removeEstimation(req.body.estimate_id);

                    return res
                        .status(200)
                        .send({ data: removeData, message: "Searching success" });
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

    // estimate_id로 평가 결과 조회. try 신청 가능 여부 확인할 때 사용
    isTryable: async (req, res) => {
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
                    const estimation = estimatemodel.getEstimationById(req.params.estimate_id);

                    return res
                        .status(200)
                        .send({ data: estimation, message: "Searching success" });
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
};