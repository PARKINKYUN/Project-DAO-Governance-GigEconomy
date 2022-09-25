const mongoose = require("mongoose");

const vote = new mongoose.Schema({
  proposalId: {
    type: String,
    required: true,
    unique: true,
  },
  proposer_id: {
    type: String,
    required: true,
  },
  proposal_id: {
    type: Number,
    required: true,
  },
  targets: { // 배열
    type: Array,
    required: true,
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
    default: "0",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// 투표 저장
vote.methods.saveVote = async function () {
  return await this.save();
};

// 전체 투표 데이터 읽어오기
vote.statics.getVote = async function () {
  return await this.find({})
}

// 투표 업데이트
vote.statics.updateVote = async function (proposalId, status) {
  return await this.findOneAndUpdate(
    { proposalId: proposalId },
    {
      status: status,
    },
    { new: true }
  );
}

//투표 삭제
vote.statics.removeVote = async function (proposalId) {
  await this.findOneAndRemove(proposalId);
};

module.exports = mongoose.model("Vote", vote)