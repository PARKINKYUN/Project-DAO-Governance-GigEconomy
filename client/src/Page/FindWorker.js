import WorkerList from "../components/WorkerList";
import withRoot from "../withRoot";
import styles from "../css/FindWorker.module.css";
import Typography from "../components/Typography";
import { useEffect, useState } from "react";
import React from "react";
import axios from "axios";
import { Grid } from "@mui/material";

function FindWorker({ token, userInfo }) {
  const [workers, setWorkers] = useState([]);

  const getWorkers = async () => {
    const res = await axios.get("http://localhost:4000/workers")
    setWorkers(res.data.data);
  }

  useEffect(() => {
    getWorkers();
  }, []);

  return (
    <div>
      <div className={styles.head}>
        <Typography variant="h3" gutterBottom marked="center" align="center">
          Worker List
        </Typography>
      </div>
      <div className={styles.container}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
        >
          {workers.map((worker, idx) => {
            return (
              <Grid item xs={2} sm={4} md={4} index={idx}>
                <WorkerList worker={worker} token={token} userInfo={userInfo} key={idx} />
              </Grid>
            );
          })}
        </Grid>
      </div>
    </div>
  );
}

export default withRoot(FindWorker);
