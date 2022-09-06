const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const worker = new mongoose.schema({
    user_id: {
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
    }
});

// 회원가입
worker.methods.saveWorker = async function () {
    const _hash = bcrypt.hash(this.password, 10);
    this.password = _hash;
    return await this.save();
;}

// 회원정보 수정
worker.statics.setWorkerInfo = async function (user_id, nickname, image, isClient ){
    return await this.findOneQAndUpdate({user_id},
        {nickname: nickname, image: image, isClient: isClient}, { new: true});
}

// 회원정보 수정 (비밀번호)
worker.statics.setWorkerPassword = async function (user_id, password) {
    const _hash = bcrypt.hash(password, 10);
    return await this.findOneQAndUpdate({user_id: user_id},
        {password: _hash}, {new: true});
}

//로그인 (아이디, 비밀번호 일치여부 확인
worker.statics.checkPassword = async function (user_id, password) {
    const _clientInfo = await this.find({user_id: user_id});
    return await bcrypt.compare(password, _clientInfo[0].password);
}

//회원정보 요청 (배열로 반환한다)
worker.statics.getWorkerInfo = async function (user_id) {
    return await this.find ({ user_id: user_id });
}

module.expots = mongoose.module("Worker", worker);