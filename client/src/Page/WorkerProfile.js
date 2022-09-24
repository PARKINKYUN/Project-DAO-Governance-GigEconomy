import withRoot from "../withRoot";
import styles2 from "../css/WorkerProfile.module.css";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from "../css/Tap.module.css";
import Profile from "../components/Profile";
import TapsList from "../components/TapsList";
import NewTapForm from "../components/NewTapForm";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

function WorkerProfile({ token, userInfo }) {
  const [reviews, setReviews] = useState([]);
  const [flag, setFlag] = useState(false);
  const [taps, setTaps] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const [evalAvg, setEvalAvg] = useState(0);
  const [evalCount, setEvalCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { worker } = location.state;

  const onClick = () => {
    setFlag((hidden) => !hidden);
  };

  useEffect(() => {
    const getOrdersList = async () => {
      const res = await axios.get('http://localhost:4000/taps/taplistbyclient', { headers: { authorization: token } });
      const tapsInfo = res.data.data;
      if (tapsInfo !== undefined) {
        const tapByWorker = tapsInfo.filter((tap) => tap.worker_id === worker.worker_id);
        setTaps(tapByWorker);
      }
    }
    getOrdersList();
    getReviews();
    getOrderByWorker();
    getEvaluation();
  }, []);

  const getReviews = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/reviews/reviewlistbyworker/${worker.worker_id}`, { headers: { authorization: token } });
      setReviews(res.data.data);
    } catch (err) {
      console.error(err);
      window.alert("리뷰 목록을 불러오는데 실패했습니다. 다시 시도해주세요.");
      navigate(-1);
    }
  }

  const getOrderByWorker = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/orders/getFinishedOrderByWorker/${worker.worker_id}`, { headers: { authorization: token } });
      const orderData = res.data.data;
      const filteredData = orderData.filter((order) => order.status === "finished");
      console.log(filteredData)
      setOrderCount(filteredData.length);
    } catch (err) {
      console.error(err);
      window.alert("페이지에 오류가 있습니다. 이전 페이지로 돌아갑니다.")
      navigate(-1);
    }
  }

  const getEvaluation = async () => {
    try {
      const res = await axios.get(`http://localhost:4000/estimate/getResultByWorker/${worker.worker_id}`, { headers: { authorization: token } });
      const { average_score, estimation_count, total_score } = res.data.data;
      setEvalAvg(average_score);
      setEvalCount(estimation_count);
    } catch (err) {
      console.error(err);
      window.alert("페이지에 오류가 있습니다. 이전 페이지로 돌아갑니다.")
      navigate(-1);
    }
  }

  return (
    <div className={styles2.main}>
      <div className={styles2.profile}>
        <div className={styles2.profileBox}>
          <Grid container spacing={3}>
            <Grid item xs={2} justifyContent="center" alignItems="center" >
              <Profile image={worker.image} />
            </Grid>
            <Grid item xs={2}>
              <div className={styles2.name}>
                <h4>Nickname</h4>
                <h4>완료한 Order 갯수</h4>
                <h4>평점</h4>
                <h4>평가 횟수</h4>
                <h4>누적 Gig Score</h4>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className={styles2.name}>
                <h4>{worker.nickname}</h4>
                <h4>{orderCount}</h4>
                <h4>{evalAvg === null ? 0 : evalAvg}</h4>
                <h4>{evalCount}</h4>
                <h4>{worker.gig_score}</h4>
              </div>
            </Grid>
            {userInfo.worker_id ? null :
              <Grid item xs={2} justifyContent="center" alignItems="center" >
                <Box sx={{ '& button': { m: 1 } }}>
                  <Button variant="contained" size="medium"
                    onClick={() => navigate('/directOrder', {
                      state: { worker }
                    })}>
                    Direct Order
                  </Button>
                  <Button variant="contained" size="medium" onClick={onClick}>
                    대화하기
                  </Button>
                </Box>
              </Grid>
            }
          </Grid>
        </div>
        <div>
          {flag ? (
            <NewTapForm
              token={token}
              writer={userInfo.client_id}
              client_id={userInfo.client_id}
              worker_id={worker.worker_id}
            />
          ) : null}
        </div>
        <div className={styles.reviewBox}>
          <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
            <div>
              <h3>{`${worker.nickname}의 Review`}</h3>
            </div>
            <li className={styles.taps}>
              {reviews.length !== 0 ?
                (reviews.map((review) => {
                  return (
                    <Accordion key={review._id}>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel1a-content"
                        id="panel1a-header"
                      >
                        <Typography><h5>Order Title : {review.order_title}</h5></Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>
                          {review.content}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  )
                }))
                : null}
            </li>
          </div>
        </div>
        <div>
          <TapsList token={token} userInfo={userInfo} taps={taps} />
        </div>
      </div>
    </div>
  );
}

export default withRoot(WorkerProfile);
