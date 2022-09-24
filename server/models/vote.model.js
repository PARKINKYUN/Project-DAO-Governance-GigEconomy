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
  propoal_id: {
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
    enum: ["Pending", "Active", "Canceled", "Defeated", "Succeeded", "Queued", "Expired", "Executed"],
    default: "Pending",
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

// 투표 업데이트
vote.statics.updateVote = async function (obj) {
  return await this.findOneAndUpdate(
    { proposalId: obj.proposalId },
    {
      for: obj.for,
      against: obj.against,
      status: obj.status,
    },
    { new: true }
  );
}

module.exports = mongoose.model("Vote", vote)