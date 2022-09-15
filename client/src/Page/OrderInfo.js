import { useEffect, useState } from "react";
import axios from "axios";
import OfferCard from "../components/OfferCard";
import TapsList from "../components/TapsList";
import withRoot from "../withRoot";
import styles from "../css/OrderInfo.module.css";
import { Grid } from "@mui/material";
import Typography from "../components/Typography";
import { useLocation } from "react-router-dom";

function OrderInfo({ isWorker }) {
  const [order, setOrder] = useState({});
  const [orderStatus, setOrderStatus] = useState("");
  const [offerIdx, setOfferIdx] = useState(null);

  const location = useLocation();
  const { id } = location.state;

  useEffect(() => {
    getOrder();
  }, [orderStatus, offerIdx]);

  const chooseOffer = (e) => {
    setOfferIdx(e.target.index);
  };

  // 오더 정보 불러오기
  const getOrder = async () =>
    await axios
      .get(`http://localhost:4000/order_info/${id}`)
      .then((res) => {
        setOrder(res.data);
      })
      .catch((err) => console.error(err));

  // 오더 수정
  // const editOrder = async () => {
  //   await axios
  //     .patch(`http://localhost:4000/order_info/${_id}/edit`)
  //     .catch((err) => console.error(err));
  // };

  // 오더 삭제
  // const removeOrder = async () => {
  //   await axios
  //     .patch(`http://localhost:4000/order_info/${_id}/remove`)
  //     .catch((err) => console.error(err));
  // };

  // 클라이언트가 워커의 제안을 선택하여 오더 시작
  const clientStartOrder = async () => {
    if (isWorker === true) return console.log("클라이언트만 가능합니다.");
    offerIdx !== null
      ? await axios
          .patch(`http://localhost:4000/order_info/${id}/client_start`, {
            offer_idx: offerIdx,
          })
          .then(() => setOrderStatus("ongoing"))
          .catch((err) => console.error(err))
      : console.log("오퍼를 선택해주세요.");
  };

  // 워커가 direct_order를 통해 생성된 오더 시작
  const workerStartOrder = async () => {
    if (isWorker === false) return console.log("워커만 가능합니다.");
    await axios
      .patch(`http://localhost:4000/order_info/${id}/worker_start`)
      .then(() => setOrderStatus("ongoing"))
      .catch((err) => console.error(err));
  };

  // 오더 연장
  // const extendOrder = async () => {
  //   await axios
  //     .patch(`http://localhost:4000/order_info/${_id}/extend`)
  //     .catch((err) => console.error(err));
  // };

  // 오더 취소
  // const cancelOrder = async () => {
  //   await axios
  //     .patch(`http://localhost:4000/order_info/${_id}/cancel`)
  //     .catch((err) => console.error(err));
  // };

  // 오더 완료
  const finishOrder = async () => {
    if (isWorker === true) return console.log("클라이언트만 가능합니다.");
    await axios
      .patch(`http://localhost:4000/order_info/${id}/finish`)
      .then(() => setOrderStatus("finished"))
      .catch((err) => console.error(err));
  };

  const handleOffers = () => {
    if (isWorker === false) {
      return (
        <div>
          {order.offers.map((offer, idx) => {
            <OfferCard
              index={idx}
              worker={offer.worker}
              deadline={offer.deadline}
              compensation={offer.compensation}
              message={offer.message}
              onClick={chooseOffer}
            />;
          })}
        </div>
      );
    }
    if (isWorker === true) {
      return (
        <div>
          {order.offers.map((offer) => {
            <div>
              <OfferCard
                worker={offer.worker}
                deadline={offer.deadline}
                compensation={offer.compensation}
                message={offer.message}
              />
            </div>;
          })}
          {/* <button onClick={handleOpen}>Make Offer</button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Text in a modal
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
            </Box>
          </Modal> */}
        </div>
      );
    }
  };
  const handlePendingOrder = () => {
    if (order.direct_order === true) {
      if (isWorker === false) {
        return (
          <div>{/* <button onClick={removeOrder}>Remove Order</button> */}</div>
        );
      }
      if (isWorker === true) {
        return (
          <div>
            <button onClick={workerStartOrder}>Start Order</button>
          </div>
        );
      }
    }
    if (order.direct_order === false) {
      if (isWorker === false) {
        return (
          <div>
            {/* <button onClick={editOrder}>Edit Order</button>
            <button onClick={removeOrder}>Remove Order</button> */}
            <button onClick={clientStartOrder}>Start Order</button>
          </div>
        );
      }
    }
  };

  const handleOngoingOrder = () => {
    if (isWorker === false) {
      return (
        <div>
          {/* <button onClick={extendOrder}>Extend Order</button>
          <button onClick={cancelOrder}>Cancel Order</button> */}
          <button onClick={finishOrder}>Finish Order</button>
        </div>
      );
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.order}>
        <div className={styles.orderBox}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="stretch"
            columnSpacing={{ xs: 1 }}
          >
            <Grid item>
              <Typography variant="body2" color="text.secondary">
                {order.title}
              </Typography>
              <div className={styles.name}>
                <h4>Client{order.client_id}</h4>
                <h4>Worker{order.worker_id}</h4>
                <h4>Deadline{order.deadline}</h4>
                <h4>compensation{order.compensation}</h4>
                <h4>Status{order.status}</h4>
              </div>
            </Grid>

            {order.direct_order === true && order.status === "pending" ? (
              <Grid item>
                <Typography variant="body2" color="text.secondary">
                  Offers
                </Typography>
                {handleOffers()}
              </Grid>
            ) : null}

            <Grid item>
              <Typography variant="body2" color="text.secondary">
                orderController
              </Typography>
              <div>
                {order.status === "pending" ? handlePendingOrder() : null}
                {order.status === "ongoing" || order.status === "extended"
                  ? handleOngoingOrder()
                  : null}
              </div>
            </Grid>

            <Grid item>
              {/* <div>
                <TapsList />
              </div> */}
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default withRoot(OrderInfo);
