const mongoose = require("mongoose");

// Daemon이 탐색했던 블럭의 번호만 저장하여
// 동일한 블럭은 다시 탐색하지 않도록 하는 역할.
// DB에 시작 도큐먼트를 저장해두어야 한다.
const blockRange = new mongoose.Schema({
    start: {
        type: Number,
        required: true,
    },
    end: {
        type: Number,
        required: true,
    },
});

// 마지막 탐색한 블럭 번호 반환
blockRange.statics.getLatestBlockNumber = async function () {
    return await this.find({});
}

// 마지막 탐색한 블럭 번호 업데이트
blockRange.statics.setLatestBlockNumber = async function (preBlockNumber, curBlockNumber) {
    return await this.findOneAndUpdate({end: preBlockNumber},
        {end: curBlockNumber}, {new: true});
}