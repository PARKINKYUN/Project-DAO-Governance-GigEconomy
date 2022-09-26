const transaction = require("../models/transactions.model");

module.exports = {
    getTransactions: async (req, res) => {
        try {
            const tx = await transaction.getTransactions();

            return res.status(200).send({ data: tx, message: "Searching success" });
        } catch (err) {
            // console.log(err);
            res.status(400).send({
                data: null,
                message: "Can't create new review",
            });
        }
    },
};