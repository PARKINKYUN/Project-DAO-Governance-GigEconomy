const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const worker = new mongoose.Schema({
  account_type: {
    type: String,
    default: "worker",
  },
  worker_id: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
    default: "15d800c968085b51d2b364d095453ff2",
  },
  pending: {
    type: Boolean,
    default: false,
  },
  gig_score: {
    type: Number,
    default: 0,
  },
  mod_authority: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
  introduction: {
    type: String,
    default: "소개글이 아직 등록되지 않았습니다."
  },
  pendingAt: {
    type: Date,
    default: Date(0),
  },
  tryAt: {
    type: Date,
    default: Date(0),
  },
});

// 회원가입
worker.methods.saveWorker = async function () {
  const _hash = await bcrypt.hash(this.password, 10);
  this.password = _hash;
  return await this.save();
};

// 회원정보 수정
worker.statics.setWorkerInfo = async function (worker_id, nickname, image, introduction) {
  return await this.findOneAndUpdate(
    { worker_id: worker_id },
    { nickname: nickname, image: image, introduction: introduction },
    { new: true }
  );
};

// 아이디와 nickname이 이미 존재하는지 확인
worker.statics.checkInputData = async function (worker_id, nickname) {
  const checkId = await this.find({worker_id: worker_id});
  const checkNickname = await this.find({nickname: nickname});
  if(checkId.length > 0 || checkNickname.length > 0) {
    return false;
  }
  return true;
}

// 닉네임이 이미 존재하는지 확인
worker.statics.checkNickname = async function (nickname) {
  const checkNickname = await this.find({nickname: nickname});
  if(checkNickname.length > 0) {
    return false;
  }
  return true;
}

// 회원정보 수정 (비밀번호)
worker.statics.setWorkerPassword = async function (worker_id, password) {
  const _hash = bcrypt.hash(password, 10);
  return await this.findOneAndUpdate(
    { workert_id: worker_id },
    { password: _hash },
    { new: true }
  );
};

// 로그인 (아이디, 비밀번호 일치여부 확인)
worker.statics.checkPassword = async function (worker_id, password) {
  const _workerInfo = await this.find({ worker_id: worker_id });
  return await bcrypt.compare(password, _workerInfo[0].password);
};

// 회원정보 요청 (배열로 반환한다)
worker.statics.getWorkerInfoById = async function (worker_id) {
  return await this.find({ worker_id: worker_id });
};

// pending 상태의 워커 리스트
worker.statics.getPendingWorker = async function () {
  return await this.find({pending: true}).sort({pendingAt: 1});
};

// pending 상태 변경(true || false)
worker.statics.togglePending = async function (worker_id) {
  const newDate = Date.now();
  const worker = await this.find({ worker_id: worker_id });

  if (worker[0].pending === false) {
    return await this.findOneAndUpdate(
      { worker_id: worker[0].worker_id },
      { pending: true, pendingAt: newDate},
      { new: true }
    );
  } else if (worker[0].pending === true) {
    return await this.findOneAndUpdate(
      { worker_id: worker[0].worker_id },
      { pending: false },
      { new: true }
    );
  }
};

// 긱 스코어
worker.statics.setGigScore = async function (worker_id, gig_score) {
  return await this.findOneAndUpdate(
    { worker_id: worker_id },
    { gig_score: gig_score }
  );
};

// 보유한 토큰의 양 업데이트
worker.statics.setToken = async function (address, balance) {
  return await this.findOneAndUpdate(
    { address: address },
    { balance: balance }
  );
};

// 보유한 긱 스코어 업데이트
worker.statics.setGigscore = async function (address, gigscore) {
  return await this.findOneAndUpdate(
    { address: address },
    { gig_score: gigscore }
  )
}

module.exports = mongoose.model("Worker", worker);
