const policymodel = require("../models/policy.model");
const jwt = require("jsonwebtoken")

module.exports = {
    // 새로운 정책 저장
    saveNewpolicy: async (req, res) => {
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
                    const newPolicy = {
                        title: req.body.title,
                        content: req.body.content,
                        worker_id: req.body.worker_id,
                        for: req.body.for,
                        against: req.body.against,
                        transactionHash: req.body.transactionHash,
                    };
                    const inputData = await policymodel.saveNewPolicy(newPolicy)
                    console.log("WoW~!!! 새로운 정책이 시행되었습니다.", inputData);

                    return res.status(200).send({ data: inputTap, message: "Created new policy"})
                }
            }
        } catch (err) {
            res.status(400).send({
                data: null,
                message: "Can't create new policy",
            });
        }
    },

    // 최근 정책 읽어오기
    getPolicies: async (req, res) => {
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
                    const policiesData = await policymodel.getPolicies();
                    console.log("최근 업데이트된 정책 조회 완료", policiesData)

                    return res.status(200).send({ data: policiesData, message: "Searching success"})
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