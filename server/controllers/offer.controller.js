const offermodel = require("../models/offer.model");
const jwt = require("jsonwebtoken")

module.exports = {
    // order_id 에 있는 offer 조회
    newofferbyorder: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404)
                    .send({ data: null, message: "Not autorized" });
            } else {
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if(!userInfo){
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    const newOffer = {
                        order_id: req.body.order_id,
                        client_id: req.body.client_id,
                        worker_id: req.body.worker_id,
                        deadline: req.body.deadline,
                        compensation: req.body.compensation,
                        message: req.body.message,
                    };
                    const inputData = await offermodel.saveNewOffer(newOffer);

                    return res.status(200).send({ data: inputData, message: "Created new policy"})
                }
            }
        } catch (err) {
            res.status(400).send({
                data: null,
                message: "Can't create new policy",
            });
        }
    },

    // order_id 에 있는 offer 조회
    offerslistbyorder: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404)
                    .send({ data: null, message: "Not autorized" });
            } else {
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if(!userInfo){
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    const offersData = await offermodel.getOffers(req.params.id);
                    return res.status(200).send({ data: offersData, message: "Searching success"})
                }
            }
        } catch (err) {
            res.status(400).send({
                data: null,
                message: "Can't search",
            });
        }
    },

    // Offer _id 로 오퍼 정보 조회
    offerslistbyoffer: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404)
                    .send({ data: null, message: "Not autorized" });
            } else {
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if(!userInfo){
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    const offersData = await offermodel.getOffersById(req.params.id);
                    console.log("offers 목록 조회 완료", offersData)
                    return res.status(200).send({ data: offersData, message: "Searching success"})
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

    // 선택된 오퍼의 상태 변경
    updateoffer: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404)
                    .send({ data: null, message: "Not autorized" });
            } else {
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if(!userInfo){
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    const offersData = await offermodel.updateOffer(req.body.order_id, req.body.worker_id);
                    console.log("offers 상태 변경 완료", offersData)
                    return res.status(200).send({ data: offersData, message: "Searching success"})
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