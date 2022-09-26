import withRoot from "../withRoot";
import styles2 from "../css/WorkerProfile.module.css";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
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
      <div className={styles2.profile}>
        <div className={styles.reviewBox}>
          <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
            <div>
              <h3>The Transactions</h3>
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
                        <Typography>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={10}>
                                    <h5>Vote ID in blockchain: </h5>
                                </Grid>
                                <Grid item xs={2}>
                                    <h5>투표결과: </h5>
                                </Grid>
                                <Grid item xs={10}>
                                    <h5>Title: </h5>
                                    <h5>Content: </h5>
                                </Grid>
                                <Grid item xs={1}>
                                    <h5>찬성: </h5>
                                    <h5>반대: </h5>
                                </Grid>
                            </Grid>
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={3}>
                                    <h5>Target Contract : </h5>
                                </Grid>
                                <Grid item xs={9}>
                                    <h5>Methods : </h5>
                                    <h5>Params : </h5>
                                    <h5>Description : </h5>
                                </Grid>
                            </Grid>
                        </Typography>
                    </AccordionDetails>
                </Accordion>
                  )
                }))
                : null}
            </li>
          </div>
        </div>
      </div>
  );
}

export default withRoot(Transactions);