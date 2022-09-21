const mongoose = require("mongoose");

const tryagainst = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  order_id: {
    type: String,
    required: true,
  },
  worker_id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  file: {
    type: String,
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
    enum: ["onBoard", "win", "loss"],
    default: "onBoard",
  },
});

// 진행중인 try 리스트
tryagainst.statics.getOnBoardTries = async function () {
  return await this.find({ status: "onBoard" });
};

// 새로운 try 신청
tryagainst.statics.newTry = async function (obj) {
  const _try = new this({
    title: obj.title,
    order_id: obj.order_id,
    worker_id: obj.worker_id,
    content: obj.content,
    file: obj.file,
  });
  return await _try.save();
}

// 정족수에 도달하여 성공한 Try의 상태 수정
tryagainst.statics.successfulTry = async function (try_id) {
  return await this.findOneAndUpdate({ _id: try_id }, { status: "win" });
}

// 기간이 만료된 try의 상태 수정
tryagainst.statics.expiredTry = async function (try_id) {
  return await this.findOneAndUpdate({ _id: try_id }, { status: "rejected" });
}

// try up 선택
tryagainst.statics.upCount = async function (try_id) {
  const _try = await this.find({ _id: try_id });
  const newCount = _try[0].up + 1;
  return await this.findOneAndUpdate({ _id: try_id }, { up: newCount });
}

// try downs 선택
tryagainst.statics.downCount = async function (try_id) {
  const _try = await this.find({ _id: try_id });
  const newCount = _try[0].down + 1;
  return await this.findOneAndUpdate({ _id: try_id }, { down: newCount });
}

module.exports = mongoose.model("Tryagainst", tryagainst)