const mongoose = require("mongoose");

const tryselector = new mongoose.Schema({
  try_id: {
    type: String,
    required: true,
  },
  moderator_id: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
});

// up, down 어떤 선택이든 누르면 해당 try 신청에 대한 클릭여부만 저장
// try 참가 올리기
tryselector.statics.saveSeletor = async function (obj) {
    const _selector = new this({
        try_id: obj.try_id,
        moderator_id: obj.worker_id,
    });
    return await _selector.save();
}

// proposal_id 에 이미 선택을 했는지 여부 반환
tryselector.statics.checkSelector = async function (obj) {
  console.log(obj, "394efdkjfk")
    return await this.find({ try_id: obj.try_id, moderator_id: obj.worker_id }).count();
}

module.exports = mongoose.model("Tryselector", tryselector)