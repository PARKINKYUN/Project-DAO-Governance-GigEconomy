import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from "@mui/material/Grid";
import styles from "../css/Tap.module.css";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const PastOrdersList = ({ token, userInfo }) => {
    const [orders, setOrders] = useState([]);
    const [expanded, setExpanded] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getOrders();

    }, [])

    const getOrders = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/orders/getOrderByClient`, { headers: { authorization: token } });
            setOrders(res.data.data);
        } catch (err) {
            console.error(err);
            window.alert("리뷰 목록을 불러오는데 실패했습니다. 다시 시도해주세요.");
            navigate(-1);
        }
    }

    const handleChange = (panel) => (isExpanded) => {
        setExpanded(isExpanded ? panel : false);
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
                                <Accordion expanded={expanded === panel} onChange={handleChange(panel)}>
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
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={4}>
                                                            Worker: {order.worker_id}
                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            Compensation: {order.compensation}
                                                        </Grid>
                                                        <Grid item xs={4}>
                                                            Deadline: {order.deadline}
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            Content: {order.content}
                                                        </Grid>
                                                    </Grid>
                                                </li>
                                            </div>
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

export default PastOrdersList;