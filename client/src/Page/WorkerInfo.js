import withRoot from "../withRoot";
import styles from "../css/WorkerProfile.module.css";
import Profile from "../components/Profile";
import TapsList from "../components/TapsList";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import OrderCard from "../components/OrderCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import TransferToken from "../components/TransferToken";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

function WorkerInfo({ token, userInfo, setUserInfo, removeCookie, setToken, setIsWorker }) {
  const [pending, setPending] = useState([]);
  const [ongoing, setOngoing] = useState([]);
  const [finished, setFinished] = useState([]);
  const [taps, setTaps] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [evalAvg, setEvalAvg] = useState(0);
  const [evalCount, setEvalCount] = useState(0);
  const [balance, setBalance] = useState(0);
  const [gigscore, setGigscore] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  // 모더레이터로 지원할 수 있는 기준
  const Mod_Contition = 100000;

  useEffect(() => {
    // 토큰을 사용하여
    // 서버로 유저의 토큰 balance 구해오는 함수 넣어야함

    getOrdersList();
    getOrderByWorker();
    getEvaluation();
    getTaps();
    getBalance();
  }, []);

  const getBalance = async () => {
    try {
      const res = await axios.patch(
        "http://localhost:4000/transfers/getbalancebyworker",
        userInfo.address,
        { headers: { authorization: token } }
      );
      setBalance(res.data.data.balance);
      setGigscore(res.data.data.gigscore);
    } catch (err) {
      window.alert(
        "토큰 잔액 정보를 업데이트 할 수 없습니다. 다시 시도해주세요."
      );
    }
  };

  // 자격이 되는 worker가 Moderator로 전환
  const applyModerator = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:4000/workers/moderator", {
        headers: { authorization: token },
      });
      if (res.status === 200) {
        setLoading(false);
        removeCookie("login")
        setToken("");
        setUserInfo({});
        setIsWorker(false);
        window.alert("축하합니다! 새로운 모더레이터가 되었습니다. 사용자 정보 업데이트를 위해 다시 로그인해주세요!")
        navigate("/signin");
      } else {
        window.alert("모더레이터 전환 중에 문제가 발생했습니다. 재로그인 후 사용자 정보를 확인하시고, Moderator로 전환이 안되었다면 다시 시도해주세요.")
      }
    } catch (err) {
      window.alert("모더레이터 전환에 실패했습니다. 다시 시도해주세요.");
      setLoading(false);
    }
  };

  const getOrderByWorker = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/orders/getFinishedOrderByWorker/${userInfo.worker_id}`,
        { headers: { authorization: token } }
      );
      const orderData = res.data.data;
      const filteredData = orderData.filter(
        (order) => order.status === "finished"
      );
      setOrderCount(filteredData.length);
    } catch (err) {
      console.error(err);
      window.alert("페이지에 오류가 있습니다. 이전 페이지로 돌아갑니다.");
      navigate(-1);
    }
  };

  const getEvaluation = async () => {
    try {
      const res = await axios.get(
        `http://localhost:4000/estimate/getResultByWorker/${userInfo.worker_id}`,
        { headers: { authorization: token } }
      );
      const { average_score, estimation_count, total_score } = res.data.data;
      setEvalAvg(average_score);
      setEvalCount(estimation_count);
    } catch (err) {
      console.error(err);
      window.alert("페이지에 오류가 있습니다. 이전 페이지로 돌아갑니다.");
      navigate(-1);
    }
  };

  const getTaps = async () => {
    const res = await axios.get("http://localhost:4000/taps/taplistbyworker", {
      headers: { authorization: token },
    });
    const tapsInfo = res.data.data;
    if (tapsInfo !== undefined) {
      setTaps(tapsInfo);
    }
  };

  const changeWorkerStatus = async () => {
    try {
      // 1. 지갑에서 펜딩전환에 따라 비용 지불/환불 (컨트랙트 배포 후 server에서 처리하는 로직 구현해야함)
      // 2. worker의 state 변경
      // 3. DB에서 worker의 state 변경
      if (userInfo.pending) {
        const res = await axios.patch(
          "http://localhost:4000/workers/toggle_status",
          {
            workerId: userInfo.worker_id,
            address: userInfo.address,
            currentStatus: userInfo.pending,
          }
        );
        setUserInfo({ ...userInfo, pending: false });
      } else {
        window.alert("사용자를 작업대기 상태로 변경합니다. 블록체인 네트워크의 상태에 따라 1~3분이 소요됩니다.")
        const res = await axios.patch(
          "http://localhost:4000/workers/toggle_status",
          {
            workerId: userInfo.worker_id,
            address: userInfo.address,
            currentStatus: userInfo.pending,
          }
        );
        setUserInfo({ ...userInfo, pending: true });
        window.alert("정상적으로 작업대기 상태가 되었습니다. 이제부터 Find Worker 페이지에 사용자의 정보가 노출됩니다.")
      }
      navigate("/workerInfo");
    } catch (err) {
      console.error(err);
      navigate("/workerInfo");
    }
  };

  const getOrdersList = async () => {
    try {
      let pendingData = [];
      let ongoingData = [];
      let finishedData = [];

      const res = await axios.get(
        "http://localhost:4000/orders/getOrderByWorker",
        { headers: { authorization: token } }
      );
      const orderData = res.data.data;
      if (orderData) {
        orderData.map((order) => {
          if (order.status === "pending") {
            pendingData.push(order);
          } else if (
            order.status === "ongoing" ||
            order.status === "extended"
          ) {
            ongoingData.push(order);
          } else if (order.status === "finished" && !order.isReviewed) {
            finishedData.push(order);
          }
        });
        setPending(pendingData);
        setOngoing(ongoingData);
        setFinished(finishedData);
      }
    } catch (err) {
      console.error(err);
      navigate("/");
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.profile}>
        <div className={styles.profileBox}>
          <Grid container spacing={3}>
            <Grid item xs={2} justifyContent="center" alignItems="center">
              <Profile image={userInfo.image} />
            </Grid>
            <Grid item xs={2}>
              <div className={styles.name}>
                <h4>Current State</h4>
                <h4>ID</h4>
                <h4>Nickname</h4>
                <h4>완료한 Order 갯수</h4>
                <h4>NPS Score</h4>
                <h4>평가 횟수</h4>
                <h4>Wallet Address</h4>
                <h4>Token Amount</h4>
                <h4>Gig Score</h4>
                <h4>Moderator</h4>
              </div>
            </Grid>
            <Grid item xs={4}>
              <div className={styles.name}>
                <h4>
                  {userInfo.pending
                    ? "Order를 기다리는 상태"
                    : "Order를 받지 않는 상태"}
                </h4>
                <h4>{userInfo.worker_id}</h4>
                <h4>{userInfo.nickname}</h4>
                <h4>{orderCount ? orderCount : 0}</h4>
                <h4>{evalAvg ? evalAvg : 0}</h4>
                <h4>{evalCount}</h4>
                <h4>{userInfo.address}</h4>
                <h4>{balance}</h4>
                <h4>{gigscore}</h4>
                <h4>
                  {userInfo.mod_authority
                    ? "The Moderator Worker"
                    : "The General Worker"}
                </h4>
              </div>
            </Grid>
            <Grid item xs={4} justifyContent="center" alignItems="center">
              <Box sx={{ "& button": { m: 1 } }}>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={changeWorkerStatus}
                >
                  상태변경
                </Button>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => navigate("/pastorderslistbyworker")}
                >
                  Order 이력
                </Button>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={() => navigate("/updateinfo")}
                >
                  회원정보수정
                </Button>
                <TransferToken token={token} isWoker={true} />
                {gigscore >= Mod_Contition && !userInfo.mod_authority ? (
                  <Button
                    variant="contained"
                    size="medium"
                    onClick={applyModerator}
                  >
                    Moderator 지원
                  </Button>
                ) : null}
              </Box>
            </Grid>
          </Grid>
        </div>
        <div className={styles.reviewBox}>
          <h4>Order 대기</h4>
          <Grid container spacing={3}>
            {pending.map((order) => {
              return (
                <Grid item xs={2} sm={4} md={4} key={order._id}>
                  <OrderCard
                    order={order}
                    key={order._id}
                    token={token}
                    userInfo={userInfo}
                    isWorker={true}
                    image={order.image}
                  />
                </Grid>
              );
            })}
          </Grid>
        </div>
        <div className={styles.reviewBox}>
          <h4>Order 작업 중</h4>
          <Grid container spacing={3}>
            {ongoing.map((order) => {
              return (
                <Grid item xs={2} sm={4} md={4} key={order._id}>
                  <OrderCard
                    order={order}
                    key={order._id}
                    token={token}
                    userInfo={userInfo}
                    isWorker={true}
                    image={order.image}
                  />
                </Grid>
              );
            })}
          </Grid>
        </div>
        <div className={styles.reviewBox}>
          <h4>Order 종료</h4>
          <Grid container spacing={3}>
            {finished.map((order) => {
              return (
                <Grid item xs={2} sm={4} md={4} key={order._id}>
                  <OrderCard
                    order={order}
                    key={order._id}
                    token={token}
                    userInfo={userInfo}
                    isWorker={true}
                    image={order.image}
                  />
                </Grid>
              );
            })}
          </Grid>
        </div>
        <div>
          <TapsList token={token} userInfo={userInfo} taps={taps} />
        </div>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <div>
          <h2>우리 모두가 GigTopia...!</h2>
          <h2>블록체인 네트워크에 새로운 Moderator를 기록하고 있습니다.</h2>
          <h2>잠시 기다려주세요.</h2>
        </div>
        <div>
          <CircularProgress color="inherit" />
        </div>
      </Backdrop>
    </div>
  );
}

export default withRoot(WorkerInfo);
