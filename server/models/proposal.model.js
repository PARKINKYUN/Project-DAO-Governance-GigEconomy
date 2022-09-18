const mongoose = require("mongoose");

const proposal = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  proposal_id: {
    type: Number,
    required: true,
    unique: true,
  },
  worker_id: {
    type: String,
    required: true,
  },
  up: {
    type: Number,
    default: 0,
  },
  down: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ["onPost", "onBallot", "rejected"],
    default: "onPost",
  },
});

// 마지막 proposal id 구하기
proposal.statics.getLatestProposalId = async function () {
  return await this.find({}).sort({ proposal_id: -1 }).limit(1);
}

// 제안 리스트
proposal.statics.getProposals = async (status) => {
  return this.find({ status: status });
};

// 제안 올리기
proposal.statics.saveProposal = async function (obj) {
  const _proposal = new this({
      proposal_id: obj.proposal_id,
      title: obj.title,
      content: obj.content,
      worker_id: obj.worker_id,
  });
  return await _proposal.save();
}

// 제안 조회
proposal.statics.proposalById = async (id) => {
  return this.findById(id);
};

// 제안 수정
proposal.statics.modifyProposal = async (id, data) => {
  const { title, content } = data;
  return this.findOneAndUpdate(
    { _id: id },
    {
      title: title,
      content: content,
    }
  );
};
// 제안 삭제
proposal.statics.deleteProposal = async (id) => {
  return this.findByIdAndRemove(id);
};

module.exports = mongoose.model("Proposal", proposal)