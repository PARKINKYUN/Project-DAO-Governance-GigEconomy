import * as React from "react";
import styles from "../css/Tap.module.css";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Propose from "./Propose";
import { useState, useEffect } from "react";
import axios from "axios";

const StandByProposal = ({ token, proposal, updateFunc }) => {
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
        <Grid item xs={2}>
          <Propose proposal={proposal} />
        </Grid>
      </Grid>
    </li>
  );
};

export default StandByProposal;
