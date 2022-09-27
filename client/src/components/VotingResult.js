import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios";
import { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import Button from "@mui/material/Button";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { useNavigate } from 'react-router-dom';

const VotingResult = ({ vote, token }) => {
    const [proposal, setProposal] = useState({});
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        getOnBallot();
    }, [])

    // onBallot(Voting) 상태의 데이터 요청
    const getOnBallot = async () => {
        try {
            const res = await axios.get(
                "http://localhost:4000/proposals/getOnBallotProposals",
                { headers: { authorization: token } }
            );
            const onBallotProposals = res.data.data;
            const proposalById = onBallotProposals.filter((proposal) => proposal.proposal_id === vote.proposal_id);
            setProposal(proposalById[0]);
        } catch (err) {
            window.alert("알 수 없는 원인으로 인하여 블록체인으로부터 진행중인 투표 데이터를 가져올 수 없습니다.")
        }
    }

    // 성공한 투표의 내용 실행
    const executeVote = async () => {
        try {
            setLoading(true);
            const res = await axios.post("http://localhost:4000/votes/execute", vote, { headers: { authorization: token } });

            window.alert("축하합니다! 투표에서 승리한 제안이 정상적으로 실행되었습니다.")
            setLoading(false);
            navigate("/ReRendering");
        } catch (err) {
            window.alert("블록체인 네트워크와의 통신에 오류가 있습니다. 잠시 후 다시 시도해주세요.")
            setLoading(false);
        }
    }

    return (
        <Accordion key={vote._id}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={10}>
                        <h5>Vote ID in blockchain: {vote.proposalId}</h5>
                    </Grid>
                    <Grid item xs={2}>
                        <h5>투표결과: {vote.status === "4" || vote.status === "8" ? "Success" : "Failure"}</h5>
                    </Grid>
                    <Grid item xs={10}>
                        <h5>Title: {proposal.title}</h5>
                        <h5>Content: {proposal.content}</h5>
                    </Grid>
                    <Grid item xs={1}>
                        <h5>찬성: {vote.for}</h5>
                        <h5>반대: {vote.against}</h5>
                    </Grid>
                    <Grid item xs={1}>
                        {vote.status === "4" ?
                            <Button variant="contained" size="small" onClick={executeVote}>
                                Execute
                            </Button>
                            : null}
                    </Grid>
                </Grid>
            </AccordionSummary>
            <AccordionDetails>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <h5>Target Contract : {vote.contract}</h5>
                    </Grid>
                    <Grid item xs={9}>
                        <h5>Methods : {vote.methods}</h5>
                        <h5>Params : {vote.params}</h5>
                        <h5>Description : {vote.description}</h5>
                    </Grid>
                </Grid>
            </AccordionDetails>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <div>
                    <h2>세상의 모든 Gig Worker가 주인이 되는 세상!</h2>
                    <h2>GigTopia DAO and Governance 입니다.</h2>
                    <h2>블록체인 네트워크에서 성공한 안건을 실행하고 있습니다.</h2>
                    <h2>잠시 기다려주세요.</h2>
                </div>
                <div>
                    <CircularProgress color="inherit" />
                </div>

            </Backdrop>
        </Accordion>
    )
}

export default VotingResult;