const mongoose = require("mongoose");

const estimate = new mongoose.Schema({
  worker_id: {
    type: String,
  },
  order_id: {
    type: String,
  },
  client_id: {
    type: String,
  },
  score: {
    type: Number,
    required: true,
  },
  isTry: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// 전체 평가 조회
estimate.statics.getEstimationAll = async () => {
    return await this.find({});
}

// worker_id로 평가 조회
estimate.statics.getEstimationByWorker = async function (worker_id) {
    return await this.find({worker_id: worker_id});
}

// order_id로 평가 조회
estimate.statics.getEstimationByOrder = async function (order_id) {
    return await this.find({order_id: order_id});
}

// estimate_id로 평가 조회 (try 가능여부 판별할 때 사용됨)
estimate.statics.getEstimationById = async function (estimate_id) {
    return await this.find({estimate_id: estimate_id});
}

// 평가 저장
estimate.methods.saveEstimation = async function () {
    return await this.save();
}

// 평가 삭제. try 성공한 경우 삭제함
estimate.statics.removeEstimation = async function (estimate_id) {
    return await this.findByIdAndRemove(estimate_id);
}

module.exports = mongoose.model("Estimate", estimate);