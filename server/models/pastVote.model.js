const mongoose = require("mongoose");

const pastvote = new mongoose.Schema({
  proposalId: {
    type: String,
  },
  proposer_id: {
    type: String,
  },
  proposal_id: {
    type: Number,
  },
  targets: { // 배열
    type: Array,
  },
  values: { // 배열
    type: Array,
  },
  calldatas: { // 배열
    type: Array,
  },
  description: {
    type: String,
  },
  contract: {
    type: String,
  },
  methods: {
    type: String,
  },
  params: {
    type: Array,
  },
  for: {
    type: Number,
    default: 0,
  },
  against: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
  },
  createdAt: {
    type: Date,
  }
});

// 투표 저장
pastvote.methods.saveVote = async function () {
  return await this.save();
};

// 최근 20개의 데이터만 읽어오기
pastvote.statics.getRecentVote = async function (proposalId) {
  return await this.find({}).sort({createdAt: -1}).limit(10);
}

// 전체 데이터 읽어오기
pastvote.statics.getVote = async function () {
    return await this.find({});
  }

module.exports = mongoose.model("Pastvote", pastvote)