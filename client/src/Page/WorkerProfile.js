import withRoot from "../withRoot";
import styles from "../css/WorkerProfile.module.css";
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
  const [flag, setFlag] = useState(false);
  const [taps, setTaps] = useState([]);

  ///
  /// 기억하라........ 브라우저 한 페이지에 보이는 모든 상태 변수는 그 페이지 컴포넌트부터 시작해서 내려가야 한다!!!!
  /// 그러니까 워커 프로필은 워커프로필에 taps 정보가 있어야 하고
  /// order 에서 오더 프로필은 오더 인포에 taps 정보가 있어야 하고
  /// 마이인포(클라이언트, 워커 각각)에서도 taps 정보가 있어야 한다.
  /// 따라서 taps리스트에 별도 분기점은 처음부터 필요가 없다!!! 설계가 잘못되었던 것.... ㅠㅠㅠㅠㅠㅠ

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
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.profile}>
        <div className={styles.profileBox}>
          <Grid container spacing={3}>
            <Grid item xs={2} justifyContent="center" alignItems="center" >
              <Profile />
            </Grid>
            <Grid item xs={2}>
              <div className={styles.name}>
                <h4>Nickname</h4>
                <h4>완료한 Order 갯수</h4>
                <h4>평점</h4>
                <h4>평가 횟수</h4>
                <h4>누적 Gig Score</h4>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className={styles.name}>
                <h4>{worker.nickname}</h4>
                <h4>구현예정</h4>
                <h4>구현예정</h4>
                <h4>구현예정</h4>
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
        <div className={styles.reviewBox}>
          <div>Worker Review</div>
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
        <div>
          <TapsList token={token} userInfo={userInfo} taps={taps} />
        </div>
      </div>
    </div>
  );
}

export default withRoot(WorkerProfile);
