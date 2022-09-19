const jwt = require("jsonwebtoken");
const order = require("../models/order.model");

module.exports = {
  // pending 중인 order 리스트
  getOrderList: async (req, res) => {
    try {
      const orders = await order.getAllOrders();
      if (!orders) {
        return res.status(400).message("order 리스트를 불러오지 못했습니다.");
      }

      return res.status(200).send({ data: orders });
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  },

  // 오더 조회
  order_info: async (req, res) => {
    try {
      const _order = await order.getOrderById(req.params.id);
      if (!_order) {
        return res.status(400).message("order를 불러오지 못했습니다.");
      }

      return res.status(200).send({ data: _order[0] });
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  },

  // client_id로 오더 정보 조회
  getOrderByClient: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res.status(404).send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const orderInfo = await order.getOrderByClient(userInfo.client_id);
          console.log("client_id로 오더 정보 조회 완료", orderInfo);

          return res
            .status(200)
            .send({ data: orderInfo, message: "Searching success" });
        }
      }
    } catch (err) {
      // console.log(err);
      res.status(400).send({
        data: null,
        message: "Can't search",
      });
    }
  },

  // worker_id로 오더 정보 조회
  getOrderByWorker: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        return res.status(404).send({ data: null, message: "Not autorized" });
      } else {
        const token = accessToken.split(" ")[0];
        const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);

        if (!userInfo) {
          return res.status(404).send({ data: null, message: "Invalid token" });
        } else {
          const orderInfo = await order.getOrderByWorker(userInfo.worker_id);
          console.log("worker_id로 오더 정보 조회 완료", orderInfo);

          return res
            .status(200)
            .send({ data: orderInfo, message: "Searching success" });
        }
      }
    } catch (err) {
      // console.log(err);
      res.status(400).send({
        data: null,
        message: "Can't search",
      });
    }
  },

  // 새로운 오더 생성
  new_order: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;
      if (!accessToken) {
        return res.status(404).send({ data: null, message: "Not autorized" });
      }

      const token = accessToken.split(" ")[0];
      const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);
      if (!userInfo) {
        return res.status(404).send({ data: null, message: "Invalid token" });
      }

      const _order = await order.postOrder(req.body);
      if (!_order) {
        return res.status(400).message("새로운 order를 생성하지 못했습니다.");
      }

      return res.status(200).send({
        data: _order._id,
        message: "order가 정상적으로 등록되었습니다.",
      });
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  },

  // 워커에게 직접 의뢰하기
  direct_order: async (req, res) => {
    try {
      const accessToken = req.headers.authorization;
      console.log(accessToken);
      if (!accessToken) {
        return res.status(404).send({ data: null, message: "Not autorized" });
      }

      const token = accessToken.split(" ")[0];
      const userInfo = jwt.verify(token, process.env.ACCESS_SECRET);
      if (!userInfo) {
        return res.status(404).send({ data: null, message: "Invalid token" });
      }

      const _order = await order.directOrder(req.params.id, req.body);
      if (!order) {
        return res.status(400).message("새로운 order를 생성하지 못했습니다.");
      }

      return res.status(200).send({
        data: _order._id,
        message: "order가 정상적으로 등록되었습니다.",
      });
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  },

  // 오더 내용 변경
  edit_order: async (req, res) => {
    try {
      const clientId = getClientId(req, res);

      const updatedOrder = await order.editOrder(req.params.id, req.body);
      if (!updatedOrder) {
        return res.status(400).message("order의 정보를 변경하지 못했습니다.");
      }

      return res.status(200).send({
        data: updatedOrder._id,
        message: "order의 정보가 변경되었습니다.",
      });
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  },

  // 워커가 pending 상태인 오더에 제안 등록
  make_offer: async (req, res) => {
    try {
      const workerId = getWorkerId(req, res);

      const orderWithOffer = await order.postOffer(
        req.params.id,
        workerId,
        req.body
      );
      if (!orderWithOffer) {
        return res.status(400).message("제안을 등록하지 못했습니다.");
      }

      return res
        .status(200)
        .send({ data: orderWithOffer._id, message: "제안이 등록되었습니다." });
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  },

  // 클라이언트가 제안 선택, 오더 시작
  clientStart: async (req, res) => {
    try {
      const clientId = getClientId(req, res);

      const order = await order.setWorkerAndStart(
        req.params.id,
        req.body.offer_index
      );
      if (!order) {
        return res.status(400).message("제안이 없습니다.");
      }

      return res
        .status(200)
        .send({ data: order._id, message: "오더가 시작되었습니다." });
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  },

  // 워커가 오더 수락, 오더 시작
  workerStart: async (req, res) => {
    try {
      const workerId = getWorkerId(req, res);

      const order = await order.acceptRequestAndStart(req.params.id);
      if (!order) {
        return res.status(400).message("에러가 발생했습니다.");
      }

      return res
        .status(200)
        .send({ data: order._id, message: "오더가 시작되었습니다." });
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  },

  // 오더 연장
  extend: async (req, res) => {
    try {
      const clientId = getClientId(req, res);

      const order = await order.extent(req.params.id);
      if (!order) {
        return res.status(400).message("에러가 발생했습니다.");
      }

      return res
        .status(200)
        .send({ data: order._id, message: "오더가 연장되었습니다." });
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  },

  // 오더 취소
  cancel: async (req, res) => {
    try {
      const clientId = getClientId(req, res);

      const order = await order.cancel(req.params.id);
      if (!order) {
        return res.status(400).message("에러가 발생했습니다.");
      }

      return res
        .status(200)
        .send({ data: order._id, message: "오더가 취소되었습니다." });
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  },

  // 오더 완료
  finish: async (req, res) => {
    try {
      const clientId = getClientId(req, res);

      const order = await order.finish(req.params.id);
      if (!order) {
        return res.status(400).message("에러가 발생했습니다.");
      }

      return res
        .status(200)
        .send({ data: order._id, message: "오더가 완료되었습니다." });
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  },

  // 오더 삭제
  remove: async (req, res) => {
    try {
      const workerId = getWorkerId(req, res);

      const removedOrder = await order.removeOrder(req.params.id);
      if (!removedOrder) {
        return res.status(400).message("오더의 삭제에 실패하였습니다.");
      }

      return res.status(200).message("오더가 삭제되었습니다.");
    } catch (err) {
      console.error(err);
      res.status(400);
    }
  },

  // client가 order에 대한 평가를 수행했는지 여부 확인
  isEstimated: async (req, res) => {
    try {
      return await isEstimated(req.params.order_id);
    } catch (err) {
      console.error(err);
    }
  },

  // worker가 order에 대한 review를 작성했는지 여부 확인
  isReviewed: async (req, res) => {
    try {
      return await this.isReviewed(req.params.order_id);
    } catch (err) {
      console.error(err);
    }
  },
};
