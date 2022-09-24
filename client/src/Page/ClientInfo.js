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
import TransferToken from "../components/TransferToken";

function ClientInfo({ token, userInfo }) {
    const [pending, setPending] = useState([]);
    const [ongoing, setOngoing] = useState([]);
    const [finished, setFinished] = useState([]);
    const [taps, setTaps] = useState([]);
    const [balance, setBalance] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        // 토큰을 사용하여
        // 서버로 유저의 토큰 balance 구해오는 함수 넣어야함

        getOrdersList();

        const getTaps = async () => {
            const res = await axios.get('http://localhost:4000/taps/taplistbyclient', { headers: { authorization: token } });
            const tapsInfo = res.data.data;
            if (tapsInfo !== undefined) {
                setTaps(tapsInfo);
            }
        }
        getTaps();
        getBalance();
    }, [token, userInfo])

    const getBalance = async () => {
        try {
            const res = await axios.patch('http://localhost:4000/transfers/getbalancebyclient', userInfo.address, { headers: { authorization: token } });
            setBalance(res.data.data);
        } catch (err) {
            window.alert("토큰 잔액 정보를 업데이트 할 수 없습니다. 다시 시도해주세요.")
        }
    }

    const getOrdersList = async () => {
        try {
            let pendingData = [];
            let ongoingData = [];
            let finishedData = [];

            const res = await axios.get('http://localhost:4000/orders/getOrderByClient', { headers: { authorization: token } });
            const orderData = res.data.data;
            if (orderData) {
                orderData.map((order) => {
                    if (order.status === "pending") {
                        pendingData.push(order);
                    } else if (order.status === "ongoing" || order.status === "extended") {
                        ongoingData.push(order);
                    } else if (order.status === "finished" && !order.isEstimated) {
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
                                <h4>ID</h4>
                                <h4>Nickname</h4>
                                <h4>Wallet Address</h4>
                                <h4>Token Amount</h4>
                            </div>
                        </Grid>
                        <Grid item xs={4}>
                            <div className={styles.name}>
                                <h4>{userInfo.client_id}</h4>
                                <h4>{userInfo.nickname}</h4>
                                <h4>{userInfo.address}</h4>
                                <h4>{balance}</h4>
                            </div>
                        </Grid>
                        <Grid item xs={4} justifyContent="center" alignItems="center" >
                            <Box sx={{ '& button': { m: 1 } }}>
                                <Button variant="contained" size="medium" onClick={() => navigate('/createorder')}>
                                    Order 생성
                                </Button>
                                <Button variant="contained" size="medium" onClick={() => navigate('/pastorderslist')}>
                                    Order 이력
                                </Button>                                
                                <Button variant="contained" size="medium" onClick={() => navigate('/updateinfo')}>
                                    회원정보수정
                                </Button>
                                <TransferToken token={token} isWorker={false} />
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
                                        isWorker={false}
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
                                        isWorker={false}
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
                                        isWorker={false}
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
        </div>
    );
}

export default withRoot(ClientInfo);