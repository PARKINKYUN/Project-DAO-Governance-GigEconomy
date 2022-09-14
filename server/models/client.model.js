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
    // default 값 필요함
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
client.methods.saveClient = async function () {
  const _hash = await bcrypt.hash(this.password, 10);
  this.password = _hash;
  return await this.save();
};

// 회원정보 수정
client.statics.setClientInfo = async function (
  client_id,
  obj
) {
  return await this.findOneAndUpdate(
    { client_id: client_id },
    { nickname: obj.nickname, image: obj.image},
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

// 보유한 토큰의 양 업데이트
client.statics.setTokenById = async function (client_id, balance) {
  return await this.findOneAndUpdate(
    { client_id: client_id },
    { balance: balance }
  );
};

module.exports = mongoose.model("Client", client);
