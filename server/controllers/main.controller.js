const reviewModel = require("../models/review.model.js");

module.exports = {
    getRecentReviews: async (req, res) => {
        try {
            const recentReviews = reviewModel.getRecentReviews();
            return res.status(200).send({ data: recentReviews, message: "Completed search" });
        } catch (err) {
            // console.error(err)
            res.status(400).send({ data: null, message: "Can't execute request" });
        }
    }
}