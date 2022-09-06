const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const client = new mongoose.Schema({
    user_id: {
        type: String,
        required: true,
        unique: true,
    },
    nickname: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
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
    isWorker: {
        type: Boolean,
        default: false,
    }
});

// 회원가입
client.methods.saveClient = async function () {
    const _hash = bcrypt.hash(this.password, 10);
    this.password = _hash;

    return await this.save();
};

// 회원정보 수정
client.statics.setClientInfo = async function (user_id, nickname, image, isWorker) {
    return await this.findOneAndUpdate({user_id: user_id},
        {nickname: nickname, image: image, isWorker: isWorker}, { new: true });
};

// 회원정보 수정(비밀번호)
client.statics.setClientPassword = async function (user_id, password) {
    const _hash = bcrypt.hash(password, 10);
    return await this.findOneAndUpdate({user_id: user_id},
        {password: _hash}, {new: true});
}

// 로그인 (아이디, 비밀번호 일치여부 확인)
client.statics.checkPassword = async function (user_id, password) {
    const _clientInfo = await this.find({user_id: user_id});
    return await bcrypt.compare(password, _clientInfo[0].password);
}

// 회원정보 요청 (배열로 반환한다)
client.statics.getClientInfo = async function (user_id) {
    return await this.find({ user_id: user_id });
}

module.exports = mongoose.model("Client", client);