import { useEffect, useState } from "react";
import axios from "axios";
import OfferCard from "../components/OfferCard";
import TapsList from "../components/TapsList";
import withRoot from "../withRoot";
import styles from "../css/OrderInfo.module.css";
import styles2 from "../css/Tap.module.css";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "../components/Typography";
import { useLocation } from "react-router-dom";
import NewTapForm from "../components/NewTapForm";

function OrderInfo() {
  const [offers, setOffers] = useState([]);
  const [taps, setTaps] = useState([]);
  const [tapFlag, setTapFlag] = useState(false);




  const [orderItem, setOrderItem] = useState({});
  const [orderStatus, setOrderStatus] = useState("");
  const [offerIdx, setOfferIdx] = useState(null);


  const location = useLocation();
  const order = location.state.order;
  const { isWorker, token, userInfo } = location.state.token;

  useEffect(() => {
    console.log("OrderInfo 페이지 props 정보", order, isWorker, token, userInfo );
    getOrder();

    // taps 리스트 받아오기. order_id로 가져와서 해당 order에 접근한 worker가 작성한 탭만 노출
    // getTaps();

  }, [orderStatus, offerIdx]);

  const getTaps = async () => {
    const res = await axios.get(`http://localhost:4000/taps/taplistbyorder/${order._id}`, { headers: { authorization: token } });
    const tapsInfo = res.data.data;
    console.log(tapsInfo)
    if (tapsInfo !== undefined) {
      const tapByWorker = tapsInfo.filter((tap) => tap.worker_id === userInfo.worker_id);
      console.log(tapByWorker)
      setTaps(tapByWorker);
    }
  }

  const chooseOffer = (e) => {
    setOfferIdx(e.target.index);
  };

  // flag 전환
  const toggleNewTap = () => {
    setFlag((hidden) => !hidden);
  };

  // 오더 정보 불러오기
  const getOrder = async () => {
    console.log("여기다여기다여기다")
    await axios
      .get(`http://localhost:4000/orders/order_info/${order._id}`)
      .then((res) => {
        setOrderItem(res.data.data);
      })
      .catch((err) => console.error(err));
  }

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
      <div className={styles.profile}>
        <div className={styles.reviewBox}>
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
        </div>
        <div className={styles.reviewBox}>
          <h4>Offer List : 총 00명이 지원했습니다.</h4>
          <li className={styles.taps}>
            {/* 오퍼 리스트 */}
            <Grid container spacing={3}>
              {orderItem.direct_order === true && orderItem.status === "pending" ? (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Offer List
                  </Typography>

                </Grid>
              ) : null}

              <Grid item xs={3}>
                {handleOffers()}
                <div>
                  {orderItem.status === "pending" ? handlePendingOrder() : null}
                  {orderItem.status === "ongoing" || orderItem.status === "extended"
                    ? handleOngoingOrder()
                    : null}
                </div>
              </Grid>
              <Grid item xs={12}>
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
          </li>
        </div>

        {/* 버튼 모음 */}
        <div className={styles.reviewBox}>
          <li className={styles2.taps}>
            <Grid container spacing={1}>
              {/* 다이렉트 오더인 경우 워커에게만 노출. */}
              {/* 다이렉트 오더가 아니라면 오더 생성자(클라이언트)에게만 노출. 클라이언트가 오퍼카드를 클릭하면 시작버튼을 누를 수 있다. */}
              <Grid item xs={2}>
                <Button variant="contained" size="small">
                  작업 시작
                </Button>
              </Grid>
              {/* 작업 취소는 오더가 펜딩 상태일 때만 가능하다. */}
              <Grid item xs={2}>
                <Button variant="contained" size="small">
                  작업 취소
                </Button>
              </Grid>
              {/* 작업 완료는 클라이언트에게만 노출된다. */}
              <Grid item xs={2}>
                <Button variant="contained" size="small">
                  작업 완료
                </Button>
              </Grid>
              {/* 작업 연장은 클라이언트에게만 노출된다. */}
              <Grid item xs={2}>
                <Button variant="contained" size="small">
                  작업 연장
                </Button>
              </Grid>
            </Grid>
          </li>
        </div>

        {/*         <div className={styles.container}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {orders.map((order) => {
              return (
                <Grid item xs={2} sm={4} md={3} >
                  <OrderCard

                  />
                </Grid>
              );
            })}
          </Grid>
        </div> */}




      </div>
    </div>
  );
}

export default withRoot(OrderInfo);
