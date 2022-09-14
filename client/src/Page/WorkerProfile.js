import withRoot from "../withRoot";
import styles from "../css/WorkerProfile.module.css";
import Profile from "../components/Profile";
import Grid from "@mui/material/Grid";
import Tap from "../components/Tap";
import axios from "axios";
import { useEffect, useState } from "react";

function WorkerProfile() {
  const [workers, setWorkers] = useState("");

  const getWorker = async () => {
    const res = await axios.get(
      "http://localhost:4000/workers/worker_info/:id"
    );
    setWorkers(res.data);
  };
  useEffect(() => {
    getWorker();
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.profile}>
        <div className={styles.profileBox}>
          <Profile />
          {workers.map((worker, idx) => {
            <Grid item xs={2}>
              <div key={idx} style={{ marginLeft: "30px" }}>
                <h4>{worker.nicname}</h4>
              </div>
            </Grid>;
          })}

          <div className={styles.name}>name</div>
        </div>
        <div className={styles.reviewBox}>
          <div>Worker Review</div>
        </div>
        <div>
          <Tap />
        </div>
      </div>
    </div>
  );
}

export default withRoot(WorkerProfile);
