import * as React from "react";
import styles from "../css/Tap.module.css";
import Grid from "@mui/material/Grid";

const NewPolicy = ({ policy }) => {

    return (
        <li className={styles.taps}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <h4>{policy.title}</h4>
                </Grid>
                <Grid item xs={3}>
                    <h5>Proposer: {policy.worker_id}</h5>
                </Grid>
                <Grid item xs={3}>
                    <h5>Executed date: {policy.createdAt}</h5>
                </Grid>
                <Grid item xs={9}>
                    <div>{policy.content}</div>
                </Grid>
                <Grid item xs={3}>
                    <div>찬성표 {policy.for} : 반대표 {policy.against}</div>
                </Grid>
            </Grid>
        </li>
    )
}

export default NewPolicy;