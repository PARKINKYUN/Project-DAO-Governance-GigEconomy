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
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["onPost", "standBy", "onBallot", "rejected"],
    default: "onPost",
  },
});

// 마지막 proposal id 구하기
proposal.statics.getLatestProposalId = async function () {
  return await this.find({}).sort({ proposal_id: -1 }).limit(1);
};

// 진행중인 제안 리스트
proposal.statics.getOnPostProposals = async function () {
  return await this.find({ status: "onPost" });
};

// proposal_id 로 조회
proposal.statics.getproposalsbyid = async function (proposal_id) {
  return await this.find({ proposal_id: proposal_id})
}

// standBy 제안 리스트
proposal.statics.getStandByProposals = async function () {
  return await this.find({ status: "standBy" });
};

// onBallot 제안 리스트
proposal.statics.getOnBallotProposals = async function () {
  return await this.find({ status: "onBallot"});
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
};

// 정족수에 도달하여 성공한 제안의 상태 수정
proposal.statics.successfulProposal = async function (proposal_id) {
  return await this.findOneAndUpdate(
    { proposal_id: proposal_id },
    { status: "standBy" }
  );
};

// propose 호출 완료된 제안의 상태 수정
proposal.statics.proposedProposal = async function (proposal_id) {
  return await this.findOneAndUpdate(
    { proposal_id: proposal_id },
    { status: "onBallot" }
  );
};

// 기간이 만료된 제안의 상태 수정
proposal.statics.expiredProposal = async function (proposal_id) {
  return await this.findOneAndUpdate(
    { proposal_id: proposal_id },
    { status: "rejected" }
  );
};

// 제안 up 선택
proposal.statics.upCount = async function (proposal_id) {
  const proposal = await this.find({ proposal_id: proposal_id });
  const newCount = proposal[0].up + 1;
  return await this.findOneAndUpdate(
    { proposal_id: proposal_id },
    { up: newCount }
  );
};

// 제안 downs 선택
proposal.statics.downCount = async function (proposal_id) {
  const proposal = await this.find({ proposal_id: proposal_id });
  const newCount = proposal[0].down + 1;
  return await this.findOneAndUpdate(
    { proposal_id: proposal_id },
    { down: newCount }
  );
};

module.exports = mongoose.model("Proposal", proposal);
