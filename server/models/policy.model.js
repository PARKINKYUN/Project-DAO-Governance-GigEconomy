const mongoose = require("mongoose");

// 최근에 업데이트된 몇 개의 정책을 읽어올 것인가...
const RECENT_POLICIES = 5;

const policy = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  worker_id: {
    type: String,
    required: true,
  },
  for: {
    type: Number,
    required: true,
  },
  against: {
    type: Number,
    default: 0,
  },
  transactionHash: {
    type: String,
    default: "0x0",
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

// 최근 업데이트된 정책 리스트. (RECENT_POLICIES) 개를 읽어온다.
policy.statics.getPolicies = async function () {
  return await this.find({}).sort({createdAt: -1}).limit(RECENT_POLICIES);
};

// 제안 올리기
policy.statics.saveNewPolicy = async function (obj) {
  const _policy = new this({
    title: obj.title,
    content: obj.content,
    worker_id: obj.worker_id,
    for: obj.for,
    against: obj.against,
    transactionHash: obj.transactionHash,
  });
  return await _policy.save();
}

module.exports = mongoose.model("Policy", policy)