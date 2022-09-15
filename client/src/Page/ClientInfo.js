import withRoot from "../withRoot";
import styles from "../css/WorkerProfile.module.css";
import Profile from "../components/Profile";
import TapsList from "../components/TapsList";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Order from "../components/OrderCard";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ClientInfo({ token, userInfo, setUserInfo }) {
    const [pending, setPending] = useState([]);
    const [requested, setRequested] = useState([]);
    const [ongoing, setOngoing] = useState([]);
    const [finished, setFinished] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        // 토큰을 사용하여
        // 서버로 유저의 토큰 balance 구해오는 함수 넣어야함

        getOrdersList();
    }, [])

    const getOrdersList = async () => {
        try {
            let pendingData = [];
            let requestedData = [];
            let ongoingData = [];
            let finishedData = [];
            const res = await axios.get('http://localhost:4000/orders/order_info', { params: userInfo.client_id });
            const orderData = res.data.data.order;
            orderData.map((order) => {
                if(order.status === "pending"){
                    pendingData.push(order);
                } else if (order.status === "requested") {
                    requestedData.push(order);
                } else if (order.status === "ongoing") {
                    ongoingData.push(order);
                } else if (order.status === "finished") {
                    finishedData.push(order);
                }
            })
            setPending(pendingData);
            setRequested(requestedData);
            setOngoing(ongoingData);
            setFinished(finishedData);
        } catch (err) {
            console.error(err);
        }
    }

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
                                <h4>ID</h4>
                                <h4>Nickname</h4>
                                <h4>Wallet Address</h4>
                                <h4>Token Amount</h4>
                            </div>
                        </Grid>
                        <Grid item xs={6}>
                            <div className={styles.name}>
                                <h4>{userInfo.client_id}</h4>
                                <h4>{userInfo.nickname}</h4>
                                <h4>{userInfo.address}</h4>
                                <h4>{userInfo.balance}</h4>
                            </div>
                        </Grid>
                        <Grid item xs={2} justifyContent="center" alignItems="center" >
                            <Box sx={{ '& button': { m: 1 } }}>
                                <Button variant="contained" size="medium" onClick={() => navigate('/createorder')}>
                                    Order 생성
                                </Button>
                                {/* 회원정보 수정페이지 제작해야함 */}
                                {/* 회원정보 수정페이지 제작해야함 */}
                                {/* 회원정보 수정페이지 제작해야함 */}
                                {/* 회원정보 수정페이지 제작해야함 */}
                                {/* 회원정보 수정페이지 제작해야함 */}
                                <Button variant="contained" size="medium" onClick={() => navigate('/')}>
                                    회원정보수정
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </div>
                <div className={styles.reviewBox}>
                    <h3>대기중인 Order List</h3>
                    {pending.map((order, idx) => {
                        <Order key={idx} _id={order._id} client_id={order.client_id} title={order.title} deadline={order.deadline} compensation={order.compensation} />
                    })}
                </div>
                <div className={styles.reviewBox}>
                    <h3>Worker가 작업 신청 중인 Order List</h3>
                    {requested.map((order, idx) => {
                        <Order key={idx} _id={order._id} client_id={order.client_id} title={order.title} deadline={order.deadline} compensation={order.compensation} />
                    })}
                </div>
                <div className={styles.reviewBox}>
                    <h3>현재 작업중인 Order List</h3>
                    {ongoing.map((order, idx) => {
                        <Order key={idx} _id={order._id} client_id={order.client_id} title={order.title} deadline={order.deadline} compensation={order.compensation} />
                    })}
                </div>
                <div className={styles.reviewBox}>
                    <h3>최근 작업이 완료된 Order List</h3>
                    {finished.map((order, idx) => {
                        <Order key={idx} _id={order._id} client_id={order.client_id} title={order.title} deadline={order.deadline} compensation={order.compensation} />
                    })}
                </div>
                <div>
                    <TapsList token={token} writer={userInfo.client_id} client_id={userInfo.client_id} />
                </div>
            </div>
        </div>
    );
}

export default withRoot(ClientInfo);