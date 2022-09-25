const mongoose = require("mongoose");

const transaction = new mongoose.Schema({
    blockHash: {
        type: String,
    },
    blockNumber: {
        type: Number,
    },
    contractAddress: {
        type: String,
    },
    cumulativeGasUsed: {
        type: Number,
    },
    effectiveGasPrice: {
        type: Number,
    },
    from: {
        type: String,
    },
    gasUsed: {
        type: Number,
    },
    logs: {
        type: Array,
    },
    logsBloom: {
        type: String,
    },
    status: {
        type: Boolean,
    },
    to: {
        type: String,
    },
    transactionHash: {
        type: String,
    },
    transactionIndex: {
        type: Number,
    },
    type: {
        type: String,
    }
});

// 트랜잭션 저장
transaction.methods.saveTransaction = async function () {
    return await this.save();
};

// 최근 트랜잭션 데이터 읽어오기
transaction.statics.getTransaction = async function () {
    return await this.find({}).sort({ blockNumber: -1 }).limit(20);
}

module.exports = mongoose.model("Transaction", transaction)