const tapmodel = require("../models/tap.model");
const jwt = require("jsonwebtoken")

module.exports = {
    // tap 작성
    newtap: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404)
                    .send({ data: null, message: "Not autorized" });
            } else {
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if (!userInfo) {
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    const latestTap = await tapmodel.getLatestTapId();
                    const tap_number = latestTap[0].tap_id;

                    const newTap = {
                        tap_id: tap_number + 1,
                        writer: req.body.writer,
                        client_id: req.body.client_id,
                        worker_id: req.body.worker_id,
                        content: req.body.content,
                        order_id: req.body.order_id
                    };
                    const inputTap = await tapmodel.saveTap(newTap)
                    console.log("똑똑! 새로운 tap이 저장되었습니다.");

                    return res.status(200).send({ data: inputTap, message: "Created new tap" })
                }
            }
        } catch (err) {
            // console.log(err);
            res.status(400).send({
                data: null,
                message: "Can't create new tap",
            });
        }
    },

    // order_id로 탭 조회
    taplistbyorder: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404)
                    .send({ data: null, message: "Not autorized" });
            } else {
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if (!userInfo) {
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    const tapInfo = await tapmodel.getTapsByOrderId(req.params.order_id);
                    console.log("Order ID로 tap 정보 조회 완료", tapInfo.length);

                    return res.status(200).send({ data: tapInfo, message: "Searching success" })
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

    // client_id로 탭 조회
    taplistbyclient: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404)
                    .send({ data: null, message: "Not autorized" });
            } else {
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if (!userInfo) {
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    const tapInfo = await tapmodel.getTapsByClientId(userInfo.client_id);
                    return res.status(200).send({ data: tapInfo, message: "Searching success" })
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

    // client_id로 탭 조회
    taplistbyadmin: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404)
                    .send({ data: null, message: "Not autorized" });
            } else {
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if (!userInfo) {
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    const tapInfo = await tapmodel.getTapsByAdmin(userInfo.worker_id);
                    return res.status(200).send({ data: tapInfo, message: "Searching success" })
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

    // worker_id 로 탭 조회
    taplistbyworker: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404)
                    .send({ data: null, message: "Not autorized" });
            } else {
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if (!userInfo) {
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    const tapInfo = await tapmodel.getTapsByWorkerId(userInfo.worker_id);
                    return res.status(200).send({ data: tapInfo, message: "Searching success" })
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

    // tap_id 로 탭 조회
    taplistbytapid: async (req, res) => {
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

                if (!userInfo) {
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    const tapInfo = tapmodel.getTapByTapId(req.params.tap_id);

                    return res.status(200).send({ data: tapInfo, message: "Searching success" })
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

    // 탭 수정
    updatetap: async (req, res) => {
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

                if (!userInfo) {
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    const updatetap = await tapmodel.setTapByTapId(req.body.tap_id, req.body.content);
                    console.log("tap 수정이 완료되었습니다.", updatetap);

                    return res.status(200).send({ data: updatetap, message: "Updating success" })
                }
            }
        } catch (err) {
            // console.log(err);
            res.status(400).send({
                data: null,
                message: "Can't update tap",
            });
        }
    },

    // 탭 삭제
    deletetap: async (req, res) => {
        try {
            const accessToken = req.headers.authorization;

            if (!accessToken) {
                return res
                    .status(404)
                    .send({ data: null, message: "Not autorized" });
            } else {
                const token = accessToken.split(" ")[0];
                const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

                if (!userInfo) {
                    return res.status(404).send({ data: null, message: "Invalid token" });
                } else {
                    const deletetap = await tapmodel.deleteTapByTapId(req.body.tap_id);
                    console.log("tap 삭제가 완료되었습니다.", deletetap);

                    return res.status(200).send({ data: deletetap, message: "A tap removed" })
                }
            }
        } catch (err) {
            res.status(400).send({
                data: null,
                message: "Can't update tap",
            });
        }
    },

    // 마지막 등록된 탭 넘버 조회
    getlatesttapnum: async (req, res) => {
        try {
            const tapNumber = tapmodel.getLatestTapId();

            return res.status(200).send({ data: tapNumber, message: "Searching success" })
        } catch (err) {
            res.status(400).send({
                data: null,
                message: "Can't search",
            });
        }
    },
};