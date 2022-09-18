import { useEffect, useState } from "react";
import axios from "axios";
import OfferCard from "../components/OfferCard";
import TapsList from "../components/TapsList";
import withRoot from "../withRoot";
import styles from "../css/OrderInfo.module.css";
import { Grid } from "@mui/material";
import Typography from "../components/Typography";
import { useLocation } from "react-router-dom";
import NewTapForm from "../components/NewTapForm";

function OrderInfo() {
  const [orderItem, setOrderItem] = useState({});
  const [orderStatus, setOrderStatus] = useState("");
  const [offerIdx, setOfferIdx] = useState(null);
  const [taps, setTaps] = useState([]);
  const [flag, setFlag] = useState(false);

  const location = useLocation();
  const { order, token, userInfo, isWorker } = location.state;

  useEffect(() => {
    getOrder();

    // taps 리스트 받아오기. order_id로 가져와서 해당 order에 접근한 worker가 작성한 탭만 노출
    const getTaps = async () => {
      const res = await axios.get(`http://localhost:4000/taps/taplistbyorder/${order._id}`, { headers: {authorization: token} });
      const tapsInfo = res.data.data;
      if(tapsInfo !== undefined){
        const tapByWorker = tapsInfo.filter((tap) => tap.worker_id === userInfo.worker_id);
        setTaps(tapByWorker);
      }
    }
    
  }, [orderStatus, offerIdx]);

  const chooseOffer = (e) => {
    setOfferIdx(e.target.index);
  };

  // flag 전환
  const onClick = () => {
    setFlag((hidden) => !hidden);
  };

  // 오더 정보 불러오기
  const getOrder = async () =>
    await axios
      .get(`http://localhost:4000/orders/order_info/${order._id}`)
      .then((res) => {
        setOrderItem(res.data.data);
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
        .patch(`http://localhost:4000/order_info/${order._id}/client_start`, {
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
      .patch(`http://localhost:4000/order_info/${order._id}/worker_start`)
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
      .patch(`http://localhost:4000/order_info/${order._id}/finish`)
      .then(() => setOrderStatus("finished"))
      .catch((err) => console.error(err));
  };

  const handleOffers = () => {
    if (isWorker === false) {
      return (
        <div>
          {orderItem.offers.map((offer, idx) => {
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
          {orderItem.offers.map((offer) => {
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
    if (orderItem.direct_order === true) {
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
    if (orderItem.direct_order === false) {
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
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <div className={styles.name}>
                <Typography variant="body2" color="text.secondary">
                  <h2>{orderItem.title}</h2>
                </Typography>
              </div>
            </Grid>
            <Grid item xs={3}>
              <div className={styles.name}>
                <Typography variant="body2" color="text.secondary">
                  <h4>Client:</h4>
                  <h4>Worker:</h4>
                  <h4>Deadline:</h4>
                  <h4>compensation:</h4>
                  <h4>Status:</h4>
                  <h4>Content</h4>
                </Typography>
              </div>
            </Grid>
            <Grid item xs={9}>
              <div className={styles.name}>
                <Typography variant="body2" color="text.secondary">
                  <h4>{orderItem.client_id}</h4>
                  <h4>{orderItem.worker_id}</h4>
                  <h4>{orderItem.deadline}</h4>
                  <h4>{orderItem.compensation}</h4>
                  <h4>{orderItem.status}</h4>
                  <h4>{orderItem.content}</h4>
                </Typography>
              </div>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            {orderItem.direct_order === true && orderItem.status === "pending" ? (
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
                {orderItem.status === "pending" ? handlePendingOrder() : null}
                {orderItem.status === "ongoing" || orderItem.status === "extended"
                  ? handleOngoingOrder()
                  : null}
              </div>
            </Grid>
            <Grid item>
              <div>
                {flag ? (
                  <NewTapForm
                    token={token}
                    writer={userInfo.worker_id}
                    client_id={orderItem.client_id}
                    worker_id={userInfo.worker_id}
                    order={orderItem._id}
                  />
                ) : null}
              </div>
              <div>
                <TapsList token={token} userInfo={userInfo} taps={taps} />
              </div>
            </Grid>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default withRoot(OrderInfo);
