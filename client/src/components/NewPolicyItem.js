import withRoot from "../withRoot";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import { useState, useEffect } from 'react';
import axios from 'axios';

function NewPolicyItem({ item, token }) {
    const [proposal, setProposal] = useState({});

    useEffect(() => {
        console.log("여긴 폴리시아이템", item)
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
            const proposalById = onBallotProposals.filter((proposal) => proposal.proposal_id === item.proposal_id);
            setProposal(proposalById[0]);
        } catch (err) {
            window.alert("알 수 없는 원인으로 인하여 블록체인으로부터 진행중인 투표 데이터를 가져올 수 없습니다.")
        }
    }

    return (
        <Accordion>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={10}>
                            <h5>Vote ID in blockchain: {item.proposalId}</h5>
                        </Grid>
                        <Grid item xs={2}>
                            <h5>실행결과: {item.status === "7" ? "Success" : "Failure"}</h5>
                        </Grid>
                        <Grid item xs={10}>
                            <h5>Title: {proposal.title}</h5>
                            <h5>Content: {proposal.content}</h5>
                        </Grid>
                        <Grid item xs={1}>
                            <h5>찬성: {item.for}</h5>
                            <h5>반대: {item.against}</h5>
                        </Grid>
                    </Grid>
            </AccordionSummary>
            <AccordionDetails>
                    <Grid container spacing={2}>
                        <Grid item xs={3}>
                            <h5>Target Contract : {item.contract}</h5>
                        </Grid>
                        <Grid item xs={9}>
                            <h5>Methods : {item.methods}</h5>
                            <h5>Params : {item.params}</h5>
                            <h5>Description : {item.description}</h5>
                        </Grid>
                    </Grid>
            </AccordionDetails>
        </Accordion>
    )

}

export default withRoot(NewPolicyItem);