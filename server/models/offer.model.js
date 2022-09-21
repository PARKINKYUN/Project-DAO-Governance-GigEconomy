const mongoose = require("mongoose");

const offer = new mongoose.Schema({
    order_id: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: "15d800c968085b51d2b364d095453ff2",
    },
    client_id: {
        type: String,
        required: true,
    },
    worker_id: {
        type: String,
    },
    deadline: {
        type: String,
        required: false,
    },
    compensation: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    accepted: {
        type: Boolean,
        default: false,
    },
});

// order에 지원한 오퍼 리스트.
offer.statics.getOffers = async function (order_id) {
    return await this.find({ order_id: order_id });
};

// offer _id로 오퍼 조회
offer.statics.getOffersById = async function (offer_id) {
    return await this.find({ _id: offer_id });
}

// 제안 올리기
offer.statics.saveNewOffer = async function (obj) {
    const _offer = new this({
        order_id: obj.order_id,
        client_id: obj.client_id,
        worker_id: obj.worker_id,
        deadline: obj.deadline,
        compensation: obj.compensation,
        message: obj.message,
        image: obj.image,
    });
    return await _offer.save();
}

// 선택된 offer의 상태 변경
offer.statics.updateOffer = async function (order_id, worker_id) {
    return await this.findOneAndUpdate(
        { order_id: order_id, worker_id: worker_id },
        { accepted: true },
        { new: true }
    );
};

module.exports = mongoose.model("Offer", offer);