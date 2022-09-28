const mongoose = require("mongoose");

const proposalSelector = new mongoose.Schema({
  proposal_id: {
    type: Number,
    required: true,
  },
  worker_id: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

// up, down 어떤 선택이든 누르면 해당 proposal에 대한 클릭여부만 저장
// 제안 올리기
proposalSelector.statics.saveSeletor = async function (obj) {
    const _selector = new this({
        proposal_id: obj.proposal_id,
        worker_id: obj.worker_id,
    });
    return await _selector.save();
}

// proposal_id 에 이미 선택을 했는지 여부 반환
proposalSelector.statics.checkSelector = async function (obj) {
    return this.find({ proposal_id: obj.proposal_id, worker_id: obj.worker_id }).count();
}

module.exports = mongoose.model("ProposalSelector", proposalSelector)