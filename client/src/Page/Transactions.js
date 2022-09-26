import withRoot from "../withRoot";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from "../css/Tap.module.css";
import axios from "axios";
import { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import { useNavigate } from "react-router-dom";

function Transactions() {
    const [tx, setTx] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        getTransactions();
    }, []);

    const getTransactions = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/transactions`);
            setTx(res.data.data);
        } catch (err) {
            console.error(err);
            window.alert("트랜잭션 목록을 불러오는데 실패했습니다. 다시 시도해주세요.");
            navigate(-1);
        }
    }

    return (
        <div style={{ padding: "10px" }}>
            <div>
                <h3>Explorer Transactions</h3>
            </div>
            <li className={styles.taps}>
                {tx.length !== 0 ?
                    (tx.map((item) => {
                        return (
                            <Accordion key={item._id}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >

                                    <Grid container spacing={2} alignItems="center">
                                        <Grid item xs={7}>
                                            <h5>Transaction Hash: {item.transactionHash}</h5>
                                            <h5>Block Number: {item.blockNumber}</h5>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <h5>From: {item.from}</h5>
                                            <h5>To: {item.to}</h5>
                                        </Grid>
                                        <Grid item xs={1}>
                                            <a target="_blank" href={"https://ropsten.etherscan.io/tx/" + item.transactionHash}>EtherScan</a>
                                        </Grid>
                                    </Grid>

                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <h5>Block Hash: {item.blockHash}</h5>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <h5>Cumulative Gas Used: {item.cumulativeGasUsed}</h5>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <h5>Effective Gas Price: {item.effectiveGasPrice}</h5>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <h5>Gas Used: {item.gasUsed}</h5>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        )
                    }))
                    : null}
            </li>
        </div>
    );
}

export default withRoot(Transactions);