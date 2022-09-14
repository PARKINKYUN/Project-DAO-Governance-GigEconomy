const mongoose = require("mongoose");

// 최근에 작성된 tap 중 몇 개를 조회할 것인가
const searchCount = 5;

const tap = new mongoose.Schema({
  tap_id: {
    type: Number,
    required: true,
    unique: true,
  },
  writer: {
    type: String,
    required: true,
  },
  client_id:{
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
  order_id: {
    type: Number,
  }
});

// write
tap.methods.saveTap = async function (obj) {
    const _tap = new this({
        tap_id: obj.tap_id,
        client_id: obj.client_id,
        worker_id: obj.worker_id,
        content: obj.content
    });
    return await _tap.save();
}

// 마지막에 DB 저장된 tap_id 조회. 새로운 tap을 생성할 때 id를 알아내기 위해 사용
tap.statics.getLatestTapId = async function () {
    return await this.find({}).sort({ tap_id: -1 }).limit(1);
}

// order id로 탭 조회
tap.statics.getTapsByOrderId = async function (order_id) {
    return await this.find({ order_id: order_id });
}

// client id로 탭 조회
tap.statics.getTapsByClientId = async function (client_id) {
    return await this.find({ client_id: client_id }).sort({ tap_id: -1 });
}

// worker id로 탭 조회
tap.statics.getTapsByWorkerId = async function (worker_id) {
    return await this.find({ worker_id: worker_id }).sort({ tap_id: -1 });
}

// tap id로 탭 조회
tap.statics.getTapByTapId = async function (tap_id) {
    return await this.find({ tap_id: tap_id });
}

// tap 수정
tap.statics.setTapByTapId = async function (tap_id, content) {
    return await this.findOneAndUpdate(
        { tap_id: tap_id },
        { content: content }
    );
}

// tap 삭제
tap.statics.deleteTapByTapId = async function (tap_id) {
    return await this.deleteOne({ tap_id: tap_id })
}

module.exports = mongoose.model("Taps", tap);