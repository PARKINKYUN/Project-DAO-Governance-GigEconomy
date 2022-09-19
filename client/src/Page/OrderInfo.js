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
import { useNavigate, useLocation } from "react-router-dom";
import NewTapForm from "../components/NewTapForm";

function OrderInfo() {
  const [orderItem, setOrderItem] = useState({});
  const [offers, setOffers] = useState([]);
  const [offer, serOffer] = useState();
  const [taps, setTaps] = useState([]);
  const [tapFlag, setTapFlag] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { token, order } = location.state;
  const { userInfo, isWorker } = token;

  useEffect(() => {
    console.log("OrderInfo 페이지 props 정보", order, token);
    // 오더 정보 셋팅
    setOrderItem(order);

    // 오퍼 리스트 가져오기
    getOffers();

    // taps 리스트 받아오기. order_id로 가져와서 해당 order에 접근한 worker가 작성한 탭만 노출
    getTaps();

  }, []);

  // flag 전환
  const toggleNewTap = () => {
    setTapFlag((hidden) => !hidden);
  };

  // order_id로 offer 리스트 읽어오기
  const getOffers = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/offers/offerslistbyorder/${order._id}`, { headers: { authorization: token.token } });
      const offersInfo = res.data.data;
      console.log("오더에 지원한 오퍼 리스트", offersInfo);
      setOffers(offersInfo);
    } catch (err) {
      console.error(err);
      window.alert("서버 전송 오류! 이전 페이지로 돌아갑니다.")
      navigate(-1);
    }
  }

  // order_id로 탭 리스트 읽어오기 (order_id와 worker_id가 모두 일치해야함)
  const getTaps = async () => {
    const res = await axios.get(`http://localhost:4000/taps/taplistbyorder/${order._id}`, { headers: { authorization: token.token } });
    const tapsInfo = res.data.data;
    console.log(tapsInfo)
    if (tapsInfo !== undefined) {
      const tapByWorker = tapsInfo.filter((tap) => tap.worker_id === userInfo.worker_id);
      console.log(tapByWorker)
      setTaps(tapByWorker);
    }
  }

  // offer 중 하나를 선택했을 때 이벤트
  const chooseOffer = (e) => {
    console.log("선택한 Offer의 정보", e.target)
    serOffer(e.target.index);
  };

  // 오더 삭제. 펜딩 상태의 오더만 삭제 가능. 이미 작업 지시가 들어간 오더는 삭제할 수 없다.
  // (*** 오더 수정 기능은 고의적으로 넣지 않음. 오더를 수행하는 워커와의 분쟁으로 이어질 수 있음 ***)
  const removeOrder = async () => {
    try {
      const res = await axios.delete(`http://localhost:4000/order_info/${order._id}/remove`, { headers: { authorization: token.token } });
      console.log("오더 삭제 완료");
      window.alert("등록했던 Order가 정상적으로 삭제되었습니다.");
      navigate(-1);
    } catch (err) {
      console.log(err);
      window.alert("오류가 발생하였습니다. 다시 시도해주세요.");
      navigate("/ReRendering");
    }
  };

  // 클라이언트가 워커의 제안을 선택하여 오더 시작
  const clientStartOrder = async () => {
    try {
      if(isWorker === false && offer.worker_id !== null){
        const res = await axios.patch(`http://localhost:4000/order_info/${order._id}/client_start`,
        { offer: offer }, { headers: { authorization: token.token } });
        console.log("오더 작업 시작");
        window.alert("등록했던 Order의 작업이 시작되었습니다.");
        navigate("/ReRendering");
      }
    } catch (err) {
      console.log(err);
      window.alert("오류가 발생하였습니다. 다시 시도해주세요.");
      navigate("/ReRendering");
    }
  };

  // 워커가 direct_order를 통해 생성된 오더 시작
  const workerStartOrder = async () => {
    try {
      if(isWorker === true && order.direct_order === true){
        const res = await axios.patch(`http://localhost:4000/order_info/${order._id}/worker_start`,
        { offer: offer }, { headers: { authorization: token.token } });
        console.log("오더 작업 시작");
        window.alert("해당 Order의 작업이 시작되었습니다.");
        navigate("/ReRendering");
      }
    } catch (err) {
      console.log(err);
      window.alert("오류가 발생하였습니다. 다시 시도해주세요.");
      navigate("/ReRendering");
    }
  };

  // 만기일이 도래한 오더에 대한 기간 연장. client만 가능하다.
  const extendOrder = async () => {
    try {
      if(isWorker === false){
        const res = await axios.patch(`http://localhost:4000/order_info/${order._id}/extend`, { headers: { authorization: token.token } });
        console.log("오더 작업 기간 연장");
        window.alert("Order의 작업 기간이 연장되었습니다.");
        navigate("/ReRendering");
      }
    } catch (err) {
      console.log(err);
      window.alert("오류가 발생하였습니다. 다시 시도해주세요.");
      navigate("/ReRendering");
    }
  };

  // 오더 완료
  const finishOrder = async () => {
    try {
      if(isWorker === false){
        const res = await axios.patch(`http://localhost:4000/order_info/${order._id}/finish`, { headers: { authorization: token.token } });
        console.log("오더 작업 완료");
        window.alert("등록했던 Order의 작업이 완료되었습니다.");
        navigate("/ReRendering");
      }
    } catch (err) {
      console.log(err);
      window.alert("오류가 발생하였습니다. 다시 시도해주세요.");
      navigate("/ReRendering");
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
                <div>

                </div>
              </Grid>
              <Grid item xs={12}>
                <div>
                  {tapFlag ? (
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
