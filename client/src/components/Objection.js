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

const Objection = ({ token, tryitem, updateFunc, orders, estimations, panel }) => {
    const [up, setUp] = useState(0);
    const [down, setDown] = useState(0);
    const [order, setOrder] = useState({});
    const [estimation, setEstimation] = useState({});
    const [expanded, setExpanded] = useState(false);

    useEffect(() => {
        setUp(tryitem.up);
        setDown(tryitem.down);
    }, [expanded])

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
                window.alert("해당 제안에 대한 선택 완료!!!")
            } else {
                window.alert("서버 오류! 잠시 후 다시 시도해주세요.")
            }
        } else {
            window.alert("해당 제안에 대해 이미 선택하였습니다.")
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
                window.alert("해당 제안에 대한 선택 완료!!!")
            } else {
                window.alert("서버 오류! 잠시 후 다시 시도해주세요.")
            }
        } else {
            window.alert("해당 제안에 대해 이미 선택하였습니다.")
        }
    }

    const handleChange = (panel, worker_id) => (isExpanded) => {
        if (isExpanded) {
            const seletedOrder = orders.filter((order) => order.worker_id === worker_id);
            setOrder(seletedOrder[0]);
            const seletedEstimation = estimations.filter((estimation) => estimation.worker_id === worker_id);
            setEstimation(seletedEstimation[0]);
            setExpanded(panel);
        } else {
            setExpanded(false);
        }
    };

    return (
        <Accordion expanded={expanded === panel} onChange={handleChange(panel, tryitem.worker_id)}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
            >
                {/* 패널이 닫혀있을 때 보이는 부분 by 인균 ㅋㅋ */}
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}>
                        <Typography sx={{ width: '100%', flexShrink: 0 }}>
                            <b>{tryitem.title}</b>
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography sx={{ width: '100%', flexShrink: 0, color: 'text.secondary' }}>
                            Time: <b>{tryitem.createdAt}</b>
                        </Typography>
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
                                    <div>NPS Score : {estimation.score}</div>
                                    <div>{tryitem.content}</div>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12}>
                                    <h4>관련 Order 정보</h4>
                                </Grid>
                                <Grid item xs={6}>
                                    <div>Order Title : {order.title}</div>
                                </Grid>
                                <Grid item xs={3}>
                                    <div>Compensation : {order.compensation}</div>
                                </Grid>
                                <Grid item xs={3}>
                                    <div>Order 생성시간 : {order.createdAt}</div>
                                </Grid>
                                <Grid item xs={12}>
                                    <div>{order.content}</div>
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