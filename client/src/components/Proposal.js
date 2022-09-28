import * as React from "react";
import styles from "../css/Tap.module.css";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Proposal = ({ token, proposal }) => {
    const [up, setUp] = useState(0);
    const [down, setDown] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        setUp(proposal.up);
        setDown(proposal.down);
    }, [])

    // proposal에 up을 추가한다.
    // 1. 워커가 해당 제안에 대한 선택을 했었는지 여부를 먼저 확인한다.
    // 2. 선택을 한 적이 없다면 업카운트를 1 증가시킨다.
    const handlerUpProposal = async () => {
        const checked = await axios.get(`http://localhost:4000/proposals/checkSelector/${proposal.proposal_id}`, { headers: { authorization: token } });

        if(checked.data.data === 0) {
            const res = await axios.patch("http://localhost:4000/proposals/upCount", {proposal_id: proposal.proposal_id}, { headers: { authorization: token } });
            if(res.status === 200) {
                const newUp = up + 1;
                setUp(newUp);
                navigate("/ReRendering");
                window.alert("해당 제안에 대한 선택 완료!!!")
            } else {
                window.alert("서버 오류! 잠시 후 다시 시도해주세요.")
            }
        } else {
            window.alert("해당 제안에 대해 이미 선택하였습니다.")
        }
    }

    // proposal에 down을 추가한다.
    // 1. 워커가 해당 제안에 대한 선택을 했었는지 여부를 먼저 확인한다.
    // 2. 선택을 한 적이 없다면 다운카운트를 1 증가시킨다.
    const handlerDownProposal = async () => {
        const checked = await axios.get(`http://localhost:4000/proposals/checkSelector/${proposal.proposal_id}`, { headers: { authorization: token } });

        if(checked.data.data === 0) {
            const res = await axios.patch("http://localhost:4000/proposals/downCount", {proposal_id: proposal.proposal_id}, { headers: { authorization: token } });
            if(res.status === 200) {
                const newDown = down + 1;
                setDown(newDown);
                navigate("/ReRendering");
                window.alert("해당 제안에 대한 선택 완료!!!")
            } else {
                window.alert("서버 오류! 잠시 후 다시 시도해주세요.")
            }
        } else {
            window.alert("해당 제안에 대해 이미 선택하였습니다.")
        }
    }

    return (
        <li className={styles.taps}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <h4>{proposal.title}</h4>
                </Grid>
                <Grid item xs={3}>
                    <h5>Writer: {proposal.worker_id}</h5>
                </Grid>
                <Grid item xs={3}>
                    <h5>Created date: {proposal.createdAt}</h5>
                </Grid>
                <Grid item xs={10}>
                    <div>{proposal.content}</div>
                </Grid>
                <Grid item xs={1}>
                    <Button variant="contained" size="small" onClick={handlerUpProposal}>
                        Up {up===0 ? null: up}
                    </Button>
                </Grid>
                <Grid item xs={1}>
                    <Button variant="contained" size="small" onClick={handlerDownProposal}>
                        Down {down===0 ? null: down}
                    </Button>
                </Grid>
            </Grid>
        </li>
    )
}

export default Proposal;