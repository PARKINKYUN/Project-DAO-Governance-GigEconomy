const mongoose = require("mongoose");

const order = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  client_id: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "15d800c968085b51d2b364d095453ff2",
  },
  worker_id: {
    type: String,
  },
  category: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: ["pending", "ongoing", "extended", "finished", "canceled"],
    default: "pending",
  },
  deadline: {
    type: String,
    required: true,
  },
  compensation: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  file: [
    {
      type: String,
    },
  ],
  direct_order: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
  },
  // 중복 평가 방지 flag
  isEstimated: {
    type: Boolean,
    default: false,
  },
  // 중복 review 방지 flag
  isReviewed: {
    type: Boolean,
    default: false,
  },
});

// pending 상태인 모든 order 조회
order.statics.getAllOrders = async function () {
  return await this.find({ status: "pending", direct_order: "false" });
};

// order_id로 오더 정보 조회
order.statics.getOrderById = async function (id) {
  return await this.find({_id: id});
}

// client_id로 오더 정보 조회
order.statics.getOrderByClient = async function (client_id) {
  return await this.find({client_id: client_id});
};

// worker_id로 오더 정보 조회
order.statics.getOrderByWorker = async function (worker_id) {
  return await this.find({worker_id: worker_id});
};

// 새로운 오더 생성
order.statics.postOrder = async function (data) {
  const { client_id, title, category, deadline, compensation, content, file } =
    data;
  return await this.create({
    client_id: client_id,
    worker_id: "TBD",
    title: title,
    category: category,
    deadline: deadline,
    compensation: compensation,
    content: content,
    file: file,
  });
};

// 워커에게 직접 의뢰
order.statics.directOrder = async function (worker_id, data) {
  const { client_id, title, category, deadline, compensation, content, file } =
    data;
  return await this.create({
    client_id: client_id,
    worker_id: worker_id,
    title: title,
    category: category,
    deadline: deadline,
    compensation: compensation,
    direct_order: true,
    content: content,
    file: file,
  });
};

// 오더 내용 변경
order.statics.editOrder = async function (order_id, new_data) {
  const { title, category, deadline, compensation, content, file } = new_data;
  const _order = {
    title: title,
    category: category,
    deadline: deadline,
    compensation: compensation,
    content: content,
    file: file,
  };
  return await this.findOneAndUpdate({ _id: order_id }, _order);
};

// 오더에 제안 등록
order.statics.postOffer = async function (order_id, worker_id, offer) {
  const { deadline, compensation, message } = offer;
  const _offer = {
    worker: worker_id,
    deadline: deadline,
    compensation: compensation,
    message: message,
  };
  return await this.findOneAndUpdate(
    { _id: order_id },
    { $push: { offers: _offer } }
  );
};

// order_id에 대한 작업 시작! 오더에 데이터를 추가하고 상태를 진행중으로 변경 (현재 사용중인 함수. 삭제 금지)
order.statics.beginwork = async function (obj) {
  return await this.findOneAndUpdate({ _id: obj._id }, {
    worker_id: obj.worker_id,
    status: obj.status,
    deadline: obj.deadline,
    compensation: obj.compensation,
   });
};

// 오더 연장
order.statics.extend = async function (order_id) {
  return await this.findOneAndUpdate({ _id: order_id }, { status: "extended" });
};

// 오더 취소
order.statics.cancel = async function (order_id) {
  return await this.findOneAndUpdate({ _id: order_id }, { status: "canceled" });
};

// 오더 완료
order.statics.finish = async function (order_id) {
  return await this.findOneAndUpdate({ _id: order_id }, { status: "finished" });
};

// 오더 삭제 (pending, requested 상태인 오더만 가능)
order.statics.remove = async function (order_id) {
  await this.findByIdAndRemove(order_id);
};

// 유저의 pending 상태 오더
order.statics.pendingOrdersById = async function (accountType, id) {
  if (accountType === "client") {
    return await this.find({ client_id: id, status: "pending" });
  }
  if (accountType === "worker") {
    return await this.find({
      $or: [{ worker_id: id }, { "offers.worker": id, status: "pending" }],
    });
  }
};

// 유저의 ongoing, extended 상태 오더
order.statics.inProgressOrdersById = async function (accountType, id) {
  if (accountType === "client") {
    return await this.find({ client_id: id, status: "ongoing" || "extended" });
  }
  if (accountType === "worker") {
    return await this.find({ worker_id: id, status: "ongoing" || "extended" });
  }
};

// 유저의 finished, canceled 상태 오더
order.statics.pastOrdersById = async function (accountType, id) {
  if (accountType === "client") {
    return await this.find({ client_id: id, status: "finished" || "canceled" });
  }
  if (accountType === "worker") {
    return await this.find({ worker_id: id, status: "finished" || "canceled" });
  }
};

// order에 대한 평가를 이미 진행하였는지 여부
order.statics.isEstimated = async (order_id) => {
  const order = await this.find({_id: order_id});
  return order[0].isEstimated === true;
};

// order에 대한 리뷰를 이미 작성했는지 여부
order.statics.isReviewed = async (order_id) => {
  const order = await this.find({_id: order_id});
  return order[0].isReviewed === true;
};

// order에 평가 점수 반영
order.statics.updateScore = async (order_id, score) => {
  return await this.findOneAndUpdate({_id: order_id}, {score: score, isEstimated: true}, {new: true});
};

// order에 대한 리뷰 작성 여부 반영
order.statics.updateScore = async (order_id) => {
  return await this.findOneAndUpdate({_id: order_id}, {isReviewed: true}, {new: true});
};

module.exports = mongoose.model("Order", order);
