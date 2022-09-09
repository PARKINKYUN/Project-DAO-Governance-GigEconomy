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
  status: {
    type: String,
    required: true,
    enum: ["pending", "voting", "concluded"],
    default: "pending",
  },
});

// 제안 리스트
proposal.statics.getProposals = async (status) => {
  return this.find({ status: status });
};
// 제안 올리기
proposal.statics.newProposal = async (data) => {
  const { title, content } = data;
  return this.create({
    title: title,
    content: content,
  });
};
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
