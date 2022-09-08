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
  worker_id: {
    type: String,
  },
  category: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    required: true,
    enum: [
      "pending", // find order에 보여지게 되는 오더
      "requested", // client가 worker에게 직접 의뢰한 오더
      "ongoing",
      "extended",
      "finished",
      "canceled",
    ],
    default: "pending",
  },
  deadline: {
    type: String,
    required: true,
  },
  compensation: {
    type: Number,
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
  offers: [
    {
      worker: {
        type: String,
        required: true,
      },
      deadline: {
        type: String,
        required: true,
      },
      compensation: {
        type: Number,
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
    },
  ],
  score: {
    type: Number,
  },
});

// pending 상태인 모든 order 조회
order.statics.getAllOrders = async () => {
  return await this.find({ status: "pending" });
};

// 오더 조회
order.statics.getOrderById = async (order_id) => {
  return await this.findById(order_id);
};

// 새로운 오더 생성
order.statics.postOrder = async (client_id, order_data) => {
  const { title, category, deadline, compensation, content, file } = order_data;
  return await this.create({
    client_id: client_id,
    title: title,
    category: category,
    deadline: deadline,
    compensation: compensation,
    content: content,
    file: file,
  });
};

// 워커에게 직접 의뢰
order.statics.directOrder = async (client_id, worker_id, order_data) => {
  const { title, category, deadline, compensation, content, file } = order_data;
  return await this.create({
    client_id: client_id,
    worker_id: worker_id,
    title: title,
    category: category,
    status: "requested",
    deadline: deadline,
    compensation: compensation,
    content: content,
    file: file,
  });
};

// 오더 내용 변경
order.statics.editOrder = async (order_id, new_data) => {
  const { title, category, deadline, compensation, content, file } = new_data;
  const _order = {
    title: title,
    category: category,
    deadline: deadline,
    compensation: compensation,
    content: content,
    file: file,
  };
  return await this.findOneAndUpdate({ order_id: order_id }, _order);
};

// 오더에 제안 등록
order.statics.postOffer = async (order_id, worker_id, offer) => {
  const { deadline, compensation, message } = offer;
  const _offer = {
    worker: worker_id,
    deadline: deadline,
    compensation: compensation,
    message: message,
  };
  return await this.findOneAndUpdate(
    { order_id: order_id },
    { $push: { offers: _offer } }
  );
};

// 클라이언트가 제안을 선택, 오더의 상태를 진행중으로
order.statics.setWorkerAndStart = async (order_id, offer_index) => {
  const order = await this.findById(order_id);
  const { worker, deadline, compensation } = order.offers[offer_index];
  const _order = {
    worker_id: worker,
    status: "ongoing",
    deadline: deadline,
    compensation: compensation,
  };
  return await order.update(_order);
};

// 워커가 클라이언트의 의뢰를 수락, 오더의 상태를 진행중으로
order.statics.acceptRequestAndStart = async (order_id) => {
  return await this.findByIdAndUpdate(order_id, { status: "ongoing" });
};

// 오더 연장
order.statics.extend = async (order_id) => {
  return await this.findOneAndUpdate(
    { order_id: order_id },
    { status: "extended" }
  );
};

// 오더 취소
order.statics.cancel = async (order_id) => {
  return await this.findOneAndUpdate(
    { order_id: order_id },
    { status: "canceled" }
  );
};

// 오더 완료
order.statics.finish = async (order_id) => {
  return await this.findOneAndUpdate(
    { order_id: order_id },
    { status: "finished" }
  );
};

// 오더 삭제 (pending, requested 상태인 오더만 가능)
order.statics.removeOrder = async (order_id) => {
  await this.findByIdAndRemove(order_id);
};

// pending 상태의 오더 id로 조회
order.statics.pendingOrdersById = async (accountType, id) => {
  if (accountType == "client") {
    return await this.find({ client_id: id, status: "pending" });
  }
  if (accountType == "worker") {
    return await this.find({ "offers.worker": id, status: "pending" });
  }
};
// requested 상태의 오더 id로 조회
order.statics.requestedOrdersById = async (accountType, id) => {
  if (accountType == "client") {
    return await this.find({ client_id: id, status: "requested" });
  }
  if (accountType == "worker") {
    return await this.find({ worker_id: id, status: "requested" });
  }
};
// ongoing, extended 상태의 오더 id로 조회
order.statics.inProgressOrdersById = async (accountType, id) => {
  if (accountType == "client") {
    return await this.find({ client_id: id, status: "ongoing" || "extended" });
  }
  if (accountType == "worker") {
    return await this.find({ worker_id: id, status: "ongoing" || "extended" });
  }
};
// finished, canceled 상태의 오더 id로 조회
order.statics.pastOrdersById = async (accountType, id) => {
  if (accountType == "client") {
    return await this.find({ client_id: id, status: "finished" || "canceled" });
  }
  if (accountType == "worker") {
    return await this.find({ worker_id: id, status: "finished" || "canceled" });
  }
};
module.exports = mongoose.model("Order", Order);
