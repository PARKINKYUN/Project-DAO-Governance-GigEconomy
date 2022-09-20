import { useEffect, useState } from "react";
import axios from "axios";
import OfferCard from "../components/OfferCard";
import TapsList from "../components/TapsList";
import withRoot from "../withRoot";
import styles from "../css/Tap.module.css";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useNavigate, useLocation } from "react-router-dom";
import NewTapForm from "../components/NewTapForm";

function OrderInfo() {
  const [orderItem, setOrderItem] = useState({});
  const [offers, setOffers] = useState([]);
  const [offer, setOffer] = useState(null);
  const [taps, setTaps] = useState([]);
  const [tapFlag, setTapFlag] = useState(false);
  const [offerFlag, setOfferFlag] = useState(false);

  const [compensation, setCompensation] = useState("");
  const [deadline, setDeadline] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { token, order, userInfo, isWorker } = location.state;
  const { client_id, worker_id } = userInfo;

  useEffect(() => {
    // 오더 정보 셋팅
    setOrderItem(order);
    // 오퍼 리스트 가져오기
    getOffers();
    // taps 리스트 받아오기. order_id로 가져와서 해당 order에 접근한 worker가 작성한 탭만 노출
    getTaps();
  }, []);

  // flag 전환 (오퍼 & 탭 각각) ==================================
  const toggleNewTap = () => {
    setTapFlag((hidden) => !hidden);
  };
  const toggleNewOffer = () => {
    setOfferFlag((hidden) => !hidden);
  }

  // Resist Offer 이벤트 핸들러 ==================================
  const handleCompensation = (e) => {
    setCompensation(e.target.value);
  };
  const handleDeadline = (e) => {
    setDeadline(e.target.value);
  }
  const handleMessage = (e) => {
    setMessage(e.target.value);
  }
  const resistOffer = async () => {
    try {
      const newOffer = {
        order_id: orderItem._id,
        client_id: orderItem.client_id,
        worker_id: userInfo.worker_id,
        deadline: deadline,
        compensation: compensation,
        message: message,
        image: userInfo.image,
      };
      const res = await axios.post(`http://localhost:4000/offers/newofferbyorder`, newOffer, { headers: { authorization: token } });
      if (res.status === 200) {
        setCompensation("");
        setDeadline("")
        setMessage("")
        toggleNewOffer();
        window.alert("해당 Order에 대한 Offer 등록이 완료되었습니다.")
        navigate("/ReRendering");
      }
    } catch (err) {
      console.error(err);
      window.alert("서버 전송 오류! 이전 페이지로 돌아갑니다.")
      navigate("/findorder");
    }
  }

  // order_id로 offer 리스트 읽어오기 ==================================
  const getOffers = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/offers/offerslistbyorder/${order._id}`, { headers: { authorization: token } });
      const offersInfo = res.data.data;
      setOffers(offersInfo);
    } catch (err) {
      console.error(err);
      window.alert("서버 전송 오류! 이전 페이지로 돌아갑니다.")
      navigate(-1);
    }
  }

  // order_id로 탭 리스트 읽어오기 (order_id와 worker_id가 모두 일치해야함) ==================================
  const getTaps = async () => {
    const res = await axios.get(`http://localhost:4000/taps/taplistbyorder/${order._id}`, { headers: { authorization: token } });
    const tapsInfo = res.data.data;
    // 접속자가 worker인 경우
    if (tapsInfo !== undefined && isWorker) {
      const tapByWorker = tapsInfo.filter((tap) => tap.worker_id === userInfo.worker_id);
      setTaps(tapByWorker);
      // 접속자가 client인 경우, order 작성자에게만 노출
    } else if (tapsInfo !== undefined) {
      const tapByClient = tapsInfo.filter((tap) => tap.client_id === userInfo.client_id);
      setTaps(tapByClient);
    }
  }

  // offer 중 하나를 선택했을 때 이벤트 ==================================
  const chooseOffer = async (offer_id) => {
    const res = await axios.get(`http://localhost:4000/offers/offerslistbyoffer/${offer_id}`, { headers: { authorization: token } });
    const offerInfo = res.data.data;
    setOffer(offerInfo);
  };

  // 오더 삭제. 펜딩 상태의 오더만 삭제 가능. 이미 작업 지시가 들어간 오더는 삭제할 수 없다.
  // (*** 오더 수정 기능은 고의적으로 넣지 않음. 오더를 수행하는 워커와의 분쟁으로 이어질 수 있음 ***) ==================================
  const removeOrder = async () => {
    try {
      const res = await axios.delete(`http://localhost:4000/orders/order_info/remove`, { data: { order_id: orderItem._id }, headers: { authorization: token } });
      window.alert("등록했던 Order가 정상적으로 삭제되었습니다.");
      navigate(-1);
    } catch (err) {
      console.log(err);
      window.alert("오류가 발생하였습니다. 다시 시도해주세요.");
      navigate("/ReRendering");
    }
  };

  // 오더 시작 ==================================
  const beginWork = async () => {
    try {
      let orderInfo;
      let offerInfo;
      if (order.direct_order) {
        orderInfo = {
          _id: order._id,
          worker_id: order.worker_id,
          status: "ongoing",
          deadline: order.deadline,
          compensation: order.compensation,
        };
      } else {
        orderInfo = {
          _id: offer[0].order_id,
          worker_id: offer[0].worker_id,
          status: "ongoing",
          deadline: offer[0].deadline,
          compensation: offer[0].compensation,
        };
        offerInfo = {
          order_id: offer[0].order_id,
          worker_id: offer[0].worker_id
        }
      }
      const resOrder = await axios.patch("http://localhost:4000/orders/order_info/beginwork", orderInfo, { headers: { authorization: token } });
      if (resOrder.status !== 200) {
        window.alert("작업을 시작하지 못하였습니다. 다시 시도해주세요.")
        return;
      }
      if(!order.direct_order){
        const resOffer = await axios.patch("http://localhost:4000/offers/updateoffer", offerInfo, { headers: { authorization: token } });
      }
      console.log("오더 작업 시작!");
      window.alert("선택한 작업이 시작되었습니다.");
      navigate(-1);
    } catch (err) {
      console.log(err);
      window.alert("오류가 발생하였습니다. 다시 시도해주세요.");
      navigate("/ReRendering");
    }
  };

  // 만기일이 도래한 오더에 대한 기간 연장. client만 가능하다. ==================================
  const extendOrder = async () => {
    try {
      const res = await axios.patch(`http://localhost:4000/orders/order_info/extend`, { order_id: orderItem._id }, { headers: { authorization: token } });
      window.alert("선택한 Order의 작업 기간이 연장되었습니다.");
      navigate("/clientInfo");
    } catch (err) {
      console.log(err);
      window.alert("오류가 발생하였습니다. 다시 시도해주세요.");
      navigate("/ReRendering");
    }
  };

  // 오더 완료 ==================================
  const finishOrder = async () => {
    try {
      const res = await axios.patch(`http://localhost:4000/orders/order_info/finish`, { order_id: orderItem._id }, { headers: { authorization: token } });
      window.alert("작업 중이었던 Order가 완료되었습니다.");
      navigate("/clientInfo");
    } catch (err) {
      console.log(err);
      window.alert("오류가 발생하였습니다. 다시 시도해주세요.");
      navigate("/ReRendering");
    }
  };

  return (
    <div style={{ padding: "10px" }}>
      {/*------------Order Information------------*/}
      <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
        <div>
          <h3>Order's Information</h3>
        </div>
        <li className={styles.taps}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={2}>
              <div className={styles.name}>
                <h4>Title :</h4>
                <h4>Client :</h4>
                <h4>Worker :</h4>
                <h4>Deadline :</h4>
                <h4>compensation :</h4>
                <h4>Status :</h4>
                <h4>Content :</h4>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className={styles.name}>
                <h4>{orderItem.title}</h4>
                <h4>{orderItem.client_id}</h4>
                <h4>{orderItem.worker_id}</h4>
                <h4>{orderItem.deadline}</h4>
                <h4>{orderItem.compensation}</h4>
                <h4>{orderItem.status}</h4>
                <h4>{orderItem.content}</h4>
              </div>
            </Grid>
            <Grid item xs={4}>
              {!orderItem.direct_order && isWorker ?
                <Button variant="contained" size="small" onClick={toggleNewOffer}>
                  Apply for this Order!
                </Button>
                : null
              }
            </Grid>
          </Grid>
        </li>
      </div>

      {/*-------- 'Apply for this order' 버튼을 누르고 새로운 오퍼를 등록한다-----------*/}
      {offerFlag ?
        <div style={{ borderBottom: "1px solid black", padding: "10px", backgroundColor: "cornsilk" }}>
          <div>
            <h3>Resist New Offer</h3>
          </div>
          <li className={styles.taps}>
            <Grid container spacing={2} justifyContent="center" alignItems="center">
              <Grid item xs={3}>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="filled-textarea"
                    label="Compensation"
                    placeholder="작업 비용을 입력하세요"
                    multiline
                    variant="filled"
                    name="compensation"
                    value={compensation}
                    onChange={handleCompensation}
                  />
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    id="filled-textarea"
                    label="Dead Line"
                    placeholder="작업에 소요되는 기간을 입력하세요"
                    multiline
                    variant="filled"
                    name="deadline"
                    value={deadline}
                    onChange={handleDeadline}
                  />
                </Box>
              </Grid>
              <Grid item xs={3}>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    fullWidth
                    id="fullWidth"
                    label="Message"
                    placeholder="전달하고 싶은 메시지를 입력하세요"
                    multiline
                    variant="filled"
                    name="message"
                    value={message}
                    onChange={handleMessage}
                  />
                </Box>
              </Grid>
              <Grid item xs={1}>
                <Button variant="contained" size="small" onClick={resistOffer} >
                  Resist
                </Button>
              </Grid>
            </Grid>
          </li>
        </div>
        : null}

      {/*------------Offer List------------*/}
      {orderItem.status === "pending" ?
        <div style={{ padding: "10px" }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            <Grid item xs={12} sm={4} md={3} key={order._id}>
              <h3>Offers List</h3>
            </Grid>
          </Grid>
          <div className={styles.container}>
            {offers.map((offer) => {
              return (
                <Grid item xs={2} sm={4} md={3} key={offer._id} >
                  <OfferCard
                    worker={offer.worker_id}
                    key={offer._id}
                    deadline={offer.deadline}
                    compensation={offer.compensation}
                    message={offer.message}
                    chooseOffer={chooseOffer}
                    offer={offer._id}
                    image={offer.image}
                  />
                </Grid>
              );
            })}
          </div>
        </div>
        :
        null
      }

      {/*------------Selected Offer Infromation & Bottons------------*/}
      <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
        <li className={styles.taps}>
          <Grid container spacing={2}>
            <Grid item xs={8}>
              {/* Offer를 선택한 경우, 선택한 오퍼의 정보를 출력한다. */}
              {(offer === null) ?
                <h4></h4>
                :
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={2}>
                    <div className={styles.name}>
                      <h4>작성자:</h4>
                      <h4>예상 작업 기간:</h4>
                      <h4>작업 비용 예측:</h4>
                      <h4>작성자 메모:</h4>
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className={styles.name}>
                      <h4>{offer[0].worker_id}</h4>
                      <h4>{offer[0].deadline}</h4>
                      <h4>{offer[0].compensation}</h4>
                      <h4>{offer[0].message}</h4>
                    </div>
                  </Grid>
                </Grid>
              }
            </Grid>
            <Grid item xs={4} justifyContent="center" alignItems="center" >
              <Box sx={{ '& button': { m: 1 } }}>
                {/* 다이렉트 오더라면 오더를 받은 워커에게만 표시. 다이렉트가 아니라면 오더를 작성한 '클라이언트만' 오퍼를 선택했을 때만 표시 */}
                {(orderItem.direct_order && orderItem.status === "pending" && orderItem.worker_id === worker_id) ||
                  (offer !== null && orderItem.client_id === client_id) ?
                  <Button variant="contained" size="medium" onClick={beginWork}>
                    작업 시작
                  </Button>
                  :
                  <Button variant="contained" disabled size="medium" >
                    작업 시작
                  </Button>
                }
                {/* 오더가 펜딩중일 때, 클라이언트만 선택 가능 */}
                {(orderItem.status === "pending" && !isWorker && orderItem.client_id === client_id) ?
                  <Button variant="contained" size="medium" onClick={removeOrder}>
                    작업 삭제
                  </Button>
                  :
                  <Button variant="contained" disabled size="medium" >
                    작업 삭제
                  </Button>
                }
                {/* 오더가 작업 중이거나 연장 중일 때, 오더를 작성한 클라이언트만 선택 가능 */}
                {(orderItem.status === "ongoing" || orderItem.status === "extended") && orderItem.client_id === client_id ?
                  <Button variant="contained" size="medium" onClick={finishOrder}>
                    작업 완료
                  </Button>
                  :
                  <Button variant="contained" disabled size="medium" >
                    작업 완료
                  </Button>
                }
                {/* 오더가 작업 중일 때, 오더를 작성한 클라이언트만 선택 가능 */}
                {(orderItem.status === "ongoing" && orderItem.client_id === client_id) ?
                  <Button variant="contained" size="medium" onClick={extendOrder}>
                    작업 연장
                  </Button>
                  :
                  <Button variant="contained" disabled size="medium" >
                    작업 연장
                  </Button>
                }
                {/* 탭 콘솔 오픈. 대화하기. worker만 선택 가능 */}
                {isWorker || orderItem.status === "ongoing" || orderItem.status === "extended" ?
                  <Button variant="contained" size="medium" onClick={toggleNewTap}>
                    대화 하기
                  </Button>
                  :
                  <Button variant="contained" disabled size="medium" >
                    대화 하기
                  </Button>
                }
              </Box>
            </Grid>
          </Grid>
        </li>
      </div>
      {/* 대화하기를 누르면 활성화되는 tap 입력 form */}
      <div>
        {(tapFlag && isWorker) ?
          <NewTapForm token={token} writer={worker_id} client_id={orderItem.client_id} worker_id={worker_id} order_id={order._id} />
          :
          null
        }
        {(tapFlag && !isWorker) ?
          <NewTapForm token={token} writer={client_id} client_id={client_id} worker_id={orderItem.worker_id} order_id={order._id} />
          :
          null
        }
      </div>
      {/* order 작성한 client와 접속한 worker탭 정보 보여주는 부분 */}
      <div>
        <TapsList token={token} userInfo={userInfo} taps={taps} order={order} />
      </div>
    </div>
  )
}

export default withRoot(OrderInfo);
