import * as React from 'react';
import PostReview from "../components/PostReview";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import styles from "../css/Tap.module.css";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PastOrdersListByWorker = ({ token, userInfo }) => {
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [review, setReview] = useState({});
    const [estimations, setEstimations] = useState([]);
    const [estimation, setEstimation] = useState({});
    const [expanded, setExpanded] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getOrders();
        getReviews();
        getEvaluation();
    }, [])

    const getOrders = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/orders/getOrderByWorker`, { headers: { authorization: token } });
            setOrders(res.data.data);
        } catch (err) {
            console.error(err);
            window.alert("Order 목록을 불러오는데 실패했습니다. 다시 시도해주세요.");
            navigate(-1);
        }
    }

    const getReviews = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/reviews/reviewlistbyworker/${userInfo.worker_id}`, { headers: { authorization: token } });
            setReviews(res.data.data);
        } catch (err) {
            console.error(err);
            window.alert("리뷰 목록을 불러오는데 실패했습니다. 다시 시도해주세요.");
            navigate(-1);
        }
    }

    const getEvaluation = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/estimate/getEstimationByWorker/${userInfo.worker_id}`, { headers: { authorization: token } });
            setEstimations(res.data.data);
        } catch (err) {
            console.error(err);
            window.alert("평가 목록을 불러오는데 실패했습니다. 다시 시도해주세요.");
            navigate(-1);
        }
    }

    const handleChange = (panel, order_id) => (isExpanded) => {
        if (isExpanded) {
            const seletedReview = reviews.filter((review) => review.order_id === order_id);
            if (seletedReview.length === 0) {
                setReview({ content: "아직 Review가 등록되지 않았습니다." })
            } else {
                setReview(seletedReview[0]);
            }
            const seletedEstimation = estimations.filter((estimation) => estimation.order_id === order_id);
            if (seletedEstimation.length === 0) {
                setEstimation({ score: "평가 전" })
            } else {
                setEstimation(seletedEstimation[0]);
            }
            setExpanded(panel);
        } else {
            setExpanded(false);
        }
        console.log(expanded)
    };

    return (
        <div style={{ padding: "10px" }}>
            <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
                <div>
                    <h3><u>{`${userInfo.nickname}`}</u> 의 전체 Orders List</h3>

                </div>
                <li className={styles.taps}>
                    {orders.length !== 0 ?
                        (orders.map((order, idx) => {
                            const panel = "panel" + idx;
                            return (
                                <Accordion expanded={expanded === panel} onChange={handleChange(panel, order._id)} key={idx}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header"
                                    >
                                        <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                            <b>{order.title}</b>
                                        </Typography>
                                        <Typography sx={{ width: '33%', flexShrink: 0, color: 'text.secondary' }}>
                                            현재 상태: <b>{order.status}</b>
                                        </Typography>
                                        <Typography sx={{ color: 'text.secondary' }}>작업 생성 시간: {order.createdAt}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Typography>
                                            {/* 패널을 확장했을 때 보이는 부분 by 인균 ㅋㅋ */}
                                            <div>
                                                <div>
                                                    <h4>Details</h4>
                                                </div>
                                                <li className={styles.taps}>
                                                    <Grid container spacing={2} alignItems="center">
                                                        <Grid item xs={6}>
                                                            Client: {order.client_id}
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            Compensation: {order.compensation}
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            Deadline: {order.deadline}
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            NPS Score: {estimation.score}
                                                        </Grid>
                                                        <Grid item xs={10}>
                                                            Content: {order.content}
                                                        </Grid>
                                                        <Grid item xs={2}>
                                                            {estimation.score <= 6 && !estimation.isTry ? (
                                                                <Button variant="contained" size="medium" onClick={() => navigate('/tryagainst', { state: { order_id: order._id, estimation_id: estimation._id } })}>
                                                                    Try objection
                                                                </Button>
                                                            ) : null}
                                                            {estimation.score <= 6 && estimation.isTry ? (
                                                                <Button variant="contained" disabled size="medium" >
                                                                    이의 제기 심사중
                                                                </Button>
                                                            ) : null}
                                                        </Grid>
                                                    </Grid>
                                                </li>
                                            </div>
                                            {/* 해당 Order에 남긴 Worker의 Review */}
                                            {order.status === "finished" && order.isReviewed ?
                                                <div>
                                                    <div>
                                                        <h4>Review</h4>
                                                    </div>
                                                    <li className={styles.taps}>
                                                        <Grid container spacing={2} alignItems="center">
                                                            <Grid item xs={12}>
                                                                Content: {review.content}
                                                            </Grid>
                                                        </Grid>
                                                    </li>
                                                </div>
                                                : null}
                                            {order.status === "finished" && !order.isReviewed ?
                                                <div>
                                                    <div>
                                                        <h4>Review</h4>
                                                    </div>
                                                    <li className={styles.taps}>
                                                        <Grid container spacing={2} alignItems="center">
                                                            <Grid item xs={1}>
                                                                <h4>Notice</h4>
                                                            </Grid>
                                                            <Grid item xs={9}>
                                                                아직 Review를 작성하지 않았습니다. 작업에 대한 진심어린 Review는 나를 더 성장시키는 힘이 됩니다.<br />
                                                                Review를 작성하려면 오른쪽 버튼을 클릭해주세요.
                                                            </Grid>
                                                            <Grid item xs={2}>
                                                                <PostReview token={token} worker_id={userInfo.worker_id} order_id={order._id} order_title={order.title} />
                                                            </Grid>
                                                        </Grid>
                                                    </li>
                                                </div>
                                                : null}
                                        </Typography>
                                    </AccordionDetails>
                                </Accordion>
                            )
                        }))
                        : null}
                </li>
            </div>
        </div>
    );
}

export default PastOrdersListByWorker;