const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const client = new mongoose.Schema({
  client_id: {
    type: String,
    required: true,
    unique: true,
  },
  account_type:{
    type: String,
    default: 'client'
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
  },
});

// 회원가입
client.methods.saveClient = async function () {
  const _hash = await bcrypt.hash(this.password, 10);
  this.password = _hash;
  return await this.save();
};

// 아이디와 nickname이 이미 존재하는지 확인
client.statics.checkInputData = async function (client_id, nickname) {
  const checkId = await this.find({client_id: client_id});
  const checkNickname = await this.find({nickname: nickname});
  if(checkId.length > 0 || checkNickname.length > 0) {
    return false;
  }
  return true;
}

// 닉네임이 이미 존재하는지 확인
client.statics.checkNickname = async function (nickname) {
  const checkNickname = await this.find({nickname: nickname});
  if(checkNickname.length > 0) {
    return false;
  }
  return true;
}

// 회원정보 수정
client.statics.setClientInfo = async function (client_id, nickname, image, introduction) {
  return await this.findOneAndUpdate(
    { client_id: client_id },
    { nickname: nickname, image: image, introduction: introduction },
    { new: true }
  );
};

// 회원정보 수정(비밀번호)
client.statics.setClientPassword = async function (client_id, password) {
  const _hash = bcrypt.hash(password, 10);
  return await this.findOneAndUpdate(
    { client_id: client_id },
    { password: _hash },
    { new: true }
  );
};

// 로그인 (아이디, 비밀번호 일치여부 확인)
client.statics.checkPassword = async function (client_id, password) {
  const _clientInfo = await this.find({ client_id: client_id });
  return await bcrypt.compare(password, _clientInfo[0].password);
};

// 회원정보 요청 (배열로 반환한다)
client.statics.getClientInfoById = async function (client_id) {
  return await this.find({ client_id: client_id });
};

// 회원정보 요청 (닉네임으로 요청)
client.statics.getClientInfoByNickname = async function (nickname) {
  return await this.find({ nickname: nickname });
}

// 보유한 토큰의 양 업데이트
client.statics.setToken = async function (address, balance) {
  return await this.findOneAndUpdate(
    { address: address },
    { balance: balance }
  );
};

module.exports = mongoose.model("Client", client);
