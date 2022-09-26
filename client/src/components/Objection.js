import * as React from "react";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import styles from "../css/Tap.module.css";
import { useState, useEffect } from "react";
import axios from "axios";

const Objection = ({ token, tryitem, updateFunc }) => {
    const [up, setUp] = useState(0);
    const [down, setDown] = useState(0);
    const [order, setOrder] = useState({});
    const [estimation, setEstimation] = useState({});

    useEffect(() => {
        setUp(tryitem.up);
        setDown(tryitem.down);
        setOrderByOrderId();
        setEstimationByOrderId();
    }, [])

    const setOrderByOrderId = async () => {
        const res = await axios.get(`http://localhost:4000/orders/order_info/${tryitem.order_id}`);
        setOrder(res.data.data);
    }

    const setEstimationByOrderId = async () => {
        const res = await axios.get(`http://localhost:4000/estimate/getEvalByOrderId/${tryitem.order_id}`);
        setEstimation(res.data.data);
    } 

    // Try에 up을 추가한다.
    // 1. 모더레이터가 해당 Try에 대한 선택을 했었는지 여부를 먼저 확인한다.
    // 2. 선택을 한 적이 없다면 업카운트를 1 증가시킨다.
    const handlerUpTry = async () => {
        const checked = await axios.get(`http://localhost:4000/tryagainst/checkSelector/${tryitem._id}`, { headers: { authorization: token } });

        if (checked.data.data === 0) {
            const res = await axios.patch("http://localhost:4000/tryagainst/upCount", { try_id: tryitem._id }, { headers: { authorization: token } });
            if (res.status === 200) {
                const newUp = up + 1;
                setUp(newUp);
                updateFunc();
                window.alert("해당 이의 신청에 대한 선택 완료!!!")
            } else {
                window.alert("서버 오류! 잠시 후 다시 시도해주세요.")
            }
        } else {
            window.alert("해당 이의 신청건에 대해 이미 선택하였습니다.")
        }
    }

    // Try에 down을 추가한다.
    // 1. 모더레이터가 해당 제안에 대한 선택을 했었는지 여부를 먼저 확인한다.
    // 2. 선택을 한 적이 없다면 다운카운트를 1 증가시킨다.
    const handlerDownTry = async () => {
        const checked = await axios.get(`http://localhost:4000/tryagainst/checkSelector/${tryitem._id}`, { headers: { authorization: token } });

        if (checked.data.data === 0) {
            const res = await axios.patch("http://localhost:4000/tryagainst/downCount", { try_id: tryitem._id }, { headers: { authorization: token } });
            if (res.status === 200) {
                const newDown = down + 1;
                setDown(newDown);
                updateFunc();
                window.alert("해당 이의 신청에 대한 선택 완료!!!")
            } else {
                window.alert("서버 오류! 잠시 후 다시 시도해주세요.")
            }
        } else {
            window.alert("해당 이의 신청건에 대해 이미 선택하였습니다.")
        }
    }

    return (
        <Accordion>
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
        >
                {/* 패널이 닫혀있을 때 보이는 부분 by 인균 ㅋㅋ */}
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                            <h5>{tryitem.title}</h5>
                    </Grid>
                    <Grid item xs={4}>
                            <h5>Time: {tryitem.createdAt}</h5>
                    </Grid>
                    <Grid item xs={1}>
                        <Button variant="contained" size="small" onClick={handlerUpTry}>
                            Up {up === 0 ? null : up}
                        </Button>
                    </Grid>
                    <Grid item xs={1}>
                        <Button variant="contained" size="small" onClick={handlerDownTry}>
                            Down {down === 0 ? null : down}
                        </Button>
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
                    {/* 패널을 확장했을 때 보이는 부분 by 인균 ㅋㅋ */}
                    <div>
                        <li className={styles.taps}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={6}>
                                    <img height="100%" src={"http://localhost:4000/images/" + tryitem.file} alt="" />
                                </Grid>
                                <Grid item xs={6}>
                                    <h5>NPS Score : {estimation.score}</h5>
                                    <h5>신청 내용 : </h5>
                                    <h5>{tryitem.content}</h5>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12}>
                                    <h4>분쟁 관련 Order 정보</h4>
                                </Grid>
                                <Grid item xs={6}>
                                    <h5>Order Title : {order.title}</h5>
                                </Grid>
                                <Grid item xs={3}>
                                    <h5>Compensation : {order.compensation}</h5>
                                </Grid>
                                <Grid item xs={3}>
                                    <h5>Order 생성시간 : {order.createdAt}</h5>
                                </Grid>
                                <Grid item xs={12}>
                                    <h5>{order.content}</h5>
                                </Grid>
                            </Grid>
                        </li>
                    </div>
                </Typography>
            </AccordionDetails>
        </Accordion>
    )
}

export default Objection;