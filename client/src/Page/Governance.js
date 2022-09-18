import withRoot from "../withRoot";
import styles from "../css/Tap.module.css";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Governance({ token, userInfo }) {
  const [voting, setVoting] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [proposals, setProposals] = useState([]);

  useEffect(() => {


  }, [])

  // 현재 진행중인 Vote를 web3를 이용해 실시간으로 읽어옴
  const getVotings = () => {

  }

  // 데몬에서 종료된 투표 데이터를 읽어서 DB에 적재하면,
  // db에서 종료된 투표 데이터를 읽어오는 로직
  const getVotes = () => {

  }

  // 투표가 종료되고 실제로 정책에 반영되면
  // 반영된 내용을 DB에 저장하고...
  // 이 함수를 통해 그 내용을 DB에서 읽어옴
  const getPolicies = () => {


  }

  // DB에서 현재 up/down 진행중인 제안을 읽어옴
  // 제안을 읽어옴과 동시에 기간이 만료된 제안은 상태를 변경하고 상태변수에 넣지 않는다.
  const getProposals = () => {


  }

  // proposal에 up을 추가한다.
  const handlerUpProposal = () => {

  }

  // proposal에 down을 추가한다.
  const handlerDownProposal = () => {

  }

  // vote / create proposal 버튼은 감춰있습니다.
  return (
    <div style={{ padding: "10px" }}>
      <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
        <li className={styles.taps}>
          <Grid container spacing={1}>
            <Grid item xs={2}>
              {userInfo.mod_authority !== false ? (
                <Button variant="contained" size="small">
                  <Link
                    style={{ color: "white" }}
                    component={RouterLink}
                    to="/createproposal"
                    state={{ token: token, userInfo: userInfo }}
                  >
                    Create Proposal
                  </Link>
                </Button>
              ) : null}
            </Grid>
            <Grid item xs={2}>
              {userInfo.mod_authority !== false ? (
                <Button variant="contained" size="small">
                  <Link
                    style={{ color: "white" }}
                    component={RouterLink}
                    to="/createproposal"
                    state={{ token: token, userInfo: userInfo }}
                  >
                    Judge Estimation
                  </Link>
                </Button>
              ) : null}
            </Grid>
            <Grid item xs={2}>
              {userInfo.mod_authority !== false ? (
                <Button variant="contained" size="small">
                  View Transactions
                </Button>
              ) : null}
            </Grid>
            <Grid item xs={2}>
              {userInfo.mod_authority !== false ? (
                <Button variant="contained" size="small">
                  Contact Support Team
                </Button>
              ) : null}
            </Grid>
          </Grid>
        </li>
      </div>

      {/*------------voting in progress------------*/}
      <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
        <div>
          <h4>Voting in progress</h4>
        </div>
        <li className={styles.taps}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              date:
            </Grid>
            <Grid item xs={10}>
              <div> content</div>
            </Grid>
            <Grid item xs={2}>
              {userInfo.mod_authority !== false ? (
                <Button variant="contained" size="small">
                  Vote
                </Button>
              ) : null}
            </Grid>
          </Grid>
        </li>
      </div>

      {/*------------voting result------------*/}
      <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
        <div>
          <h4>Voting result</h4>
        </div>
        <li className={styles.taps}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              date:
            </Grid>
            <Grid item xs={12}>
              <div> content</div>
            </Grid>
          </Grid>
        </li>
      </div>

      {/*------------Changed Policy------------*/}
      <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
        <div>
          <h4>Changed Policies</h4>
        </div>
        <li className={styles.taps}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              date:
            </Grid>
            <Grid item xs={12}>
              <div> content</div>
            </Grid>
          </Grid>
        </li>
      </div>

      {/*------------Proposal------------*/}
      <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
        <div>
          <h4>Proposals</h4>
        </div>
        <li className={styles.taps}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              date:
            </Grid>
            <Grid item xs={10}>
              <div> content</div>
            </Grid>
            <Grid item xs={1}>
              <Button variant="contained" size="small" onClick={handlerUpProposal}>
                Up
              </Button>
            </Grid>
            <Grid item xs={1}>
              <Button variant="contained" size="small" onClick={handlerDownProposal}>
                Down
              </Button>
            </Grid>
          </Grid>
        </li>
      </div>
    </div>
  );
}

export default withRoot(Governance);
