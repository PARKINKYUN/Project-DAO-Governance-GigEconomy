const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const worker = new mongoose.schema({
  worker_id: {
    type: String,
    required: true,
    unique: true,
  },
  account_type:{
    type: String,
    default: 'worker'
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
    // default 값 필요함
  },
  gig_score: {
    type: Number,
  },
  address: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    default: 0,
  },
});

// 회원가입
worker.methods.saveWorker = async function () {
  const _hash = bcrypt.hash(this.password, 10);
  this.password = _hash;
  return await this.save();
};

// 회원정보 수정
worker.statics.setWorkerInfo = async function (
  worker_id,
  nickname,
  image
) {
  return await this.findOneAndUpdate(
    { worker_id: worker_id },
    { nickname: nickname, image: image},
    { new: true }
  );
};

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
worker.statics.getWorkerInfo = async function (worker_id) {
  return await this.find({ worker_id: worker_id });
};

// 긱 스코어
worker.statics.setGigScore = async function (worker_id, gig_score) {
  return await this.findOneAndUpdate(
    { worker_id: worker_id },
    { gig_score: gig_score }
  );
};

module.exports = mongoose.model("Worker", worker);
