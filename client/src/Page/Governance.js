import withRoot from "../withRoot";
import styles from "../css/Tap.module.css";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function Governance({ token, userInfo }) {
  // /proposals/pending
  // /proposals/voting
  // /proposals/concluded
  // /new_proposal

  // vodt/ create proposal 버튼은 감춰있습니다.
  return (
    <div style={{ padding: "10px" }}>
      {/*------------voting in progress------------*/}
      <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
        <div>Voting in progress</div>
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
        <div>voting result</div>
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
        <div>Changed Policy</div>
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
        <div>proposal</div>
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
                  <Link
                    style={{ color: "white" }}
                    component={RouterLink}
                    to="/createproposal"
                    state={{ workerId: null }}
                  >
                    Create Proposal
                  </Link>
                </Button>
              ) : null}
            </Grid>
          </Grid>
        </li>
        {/*------------Proposal/Up, Down btn------------*/}
        <li className={styles.taps}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              date:
            </Grid>
            <Grid item xs={10}>
              <div> content</div>
            </Grid>
            <Grid item xs={1}>
              <Button variant="contained" size="small">
                Up
              </Button>
            </Grid>
            <Grid item xs={1}>
              <Button variant="contained" size="small">
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
