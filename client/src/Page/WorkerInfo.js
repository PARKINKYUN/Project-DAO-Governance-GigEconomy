import withRoot from "../withRoot";
import styles from "../css/WorkerProfile.module.css";
import Profile from "../components/Profile";
import TapsList from "../components/TapsList";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import OrderCard from "../components/OrderCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function WorkerInfo({ token, userInfo, setUserInfo }) {
    const [pending, setPending] = useState([]);
    const [ongoing, setOngoing] = useState([]);
    const [finished, setFinished] = useState([]);
    const [taps, setTaps] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        // 토큰을 사용하여
        // 서버로 유저의 토큰 balance 구해오는 함수 넣어야함

        console.log()

        getOrdersList();

        getTaps();
    }, [])

    // 거버넌스에 참여하는 Moderator가 되기 위한 gig-score 자격
    const Mod_Contition = 1000;
    // 자격이 되는 worker가 Moderator로 전환
    const applyModerator = () => {
        console.log("모더레이터로 전환되었습니다.")
    }

    const getTaps = async () => {
        const res = await axios.get('http://localhost:4000/taps/taplistbyworker', { headers: { authorization: token } });
        const tapsInfo = res.data.data;
        if (tapsInfo !== undefined) {
            setTaps(tapsInfo);
        }
    }


    const changeWorkerStatus = async () => {
        try {
            // 1. 지갑에서 펜딩전환에 따라 비용 지불/환불 (컨트랙트 배포 후 server에서 처리하는 로직 구현해야함)
            // 2. worker의 state 변경
            // 3. DB에서 worker의 state 변경
            if (userInfo.pending) {
                const res = await axios.patch('http://localhost:4000/workers/toggle_status',
                    { workerId: userInfo.worker_id, currentStatus: userInfo.pending });
                setUserInfo({ ...userInfo, pending: false });

            } else {
                const res = await axios.patch('http://localhost:4000/workers/toggle_status',
                    { workerId: userInfo.worker_id, currentStatus: userInfo.pending });
                setUserInfo({ ...userInfo, pending: true });
            }
            navigate("/workerInfo")
        } catch (err) {
            console.error(err);
            navigate("/workerInfo")
        }
    }

    const getOrdersList = async () => {
        try {
            let pendingData = [];
            let ongoingData = [];
            let finishedData = [];

            const res = await axios.get('http://localhost:4000/orders/getOrderByWorker', { headers: { authorization: token } });
            const orderData = res.data.data;
            if (orderData) {
                orderData.map((order) => {
                    if (order.status === "pending") {
                        pendingData.push(order);
                    } else if (order.status === "ongoing" || order.status === "extended") {
                        ongoingData.push(order);
                    } else if (order.status === "finished" || order.status === "canceled") {
                        finishedData.push(order);
                    }
                })
                setPending(pendingData);
                setOngoing(ongoingData);
                setFinished(finishedData);
            }
        } catch (err) {
            console.error(err);
            navigate("/")
        }
    }

    return (
        <div className={styles.main}>
            <div className={styles.profile}>
                <div className={styles.profileBox}>
                    <Grid container spacing={3}>
                        <Grid item xs={2} justifyContent="center" alignItems="center" >
                            <Profile image={userInfo.image} />
                        </Grid>
                        <Grid item xs={2}>
                            <div className={styles.name}>
                                <h4>Current State</h4>
                                <h4>ID</h4>
                                <h4>Nickname</h4>
                                <h4>Wallet Address</h4>
                                <h4>Token Amount</h4>
                                <h4>Gig Score</h4>
                                <h4>Moderator</h4>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div className={styles.name}>
                                <h4>{userInfo.pending ? "Order를 기다리는 상태" : "Order를 받지 않는 상태"}</h4>
                                <h4>{userInfo.worker_id}</h4>
                                <h4>{userInfo.nickname}</h4>
                                <h4>{userInfo.address}</h4>
                                <h4>{userInfo.balance}</h4>
                                <h4>{userInfo.gig_score}</h4>
                                <h4>{userInfo.mod_authority ? "The Moderator Worker" : "The General Worker"}</h4>
                            </div>
                        </Grid>
                        <Grid item xs={2} justifyContent="center" alignItems="center" >
                            <Box sx={{ '& button': { m: 1 } }}>
                                <Button variant="contained" size="medium" onClick={changeWorkerStatus}>
                                    상태변경
                                </Button>

                                {/* 회원정보 수정페이지 제작해야함 */}
                                {/* 회원정보 수정페이지 제작해야함 */}
                                {/* 회원정보 수정페이지 제작해야함 */}
                                {/* 회원정보 수정페이지 제작해야함 */}
                                {/* 회원정보 수정페이지 제작해야함 */}
                                <Button variant="contained" size="medium" onClick={() => navigate('/updateinfo')}>
                                    회원정보수정
                                </Button>
                                <Button variant="contained" size="medium" onClick={() => navigate('/')}>
                                    토큰 전송
                                </Button>
                                {userInfo.gig_score >= Mod_Contition && !userInfo.mod_authority ?
                                    <Button variant="contained" size="medium" onClick={applyModerator}>
                                        Moderator 지원
                                    </Button>
                                    : null}
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
        </div>
    );
}

export default withRoot(WorkerInfo);