import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import axios from "axios";
import { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import VoteModal from "./VoteModal";

const CastVote = ({ vote, token, userInfo }) => {
    const [proposal, setProposal] = useState({});

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

    return (
        <Accordion key={vote._id}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={10}>
                            <h5>Vote ID in blockchain: {vote.proposalId}</h5>
                        </Grid>
                        <Grid item xs={2}>
                            <h5>현재 투표 진행 중</h5>
                        </Grid>
                        <Grid item xs={10}>
                            <h5>Title: {proposal.title}</h5>
                            <h5>Content: {proposal.content}</h5>
                        </Grid>
                        <Grid item xs={2}>
                            {userInfo.mod_authority !== false ? <VoteModal vote={vote} token={token} /> : null}
                        </Grid>
                    </Grid>
                </Typography>
            </AccordionSummary>
            <AccordionDetails>
                <Typography>
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
                </Typography>
            </AccordionDetails>
        </Accordion>
    )
}

export default CastVote;