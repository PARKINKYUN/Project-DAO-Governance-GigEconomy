import WorkerList from "../components/WorkerList";
import withRoot from "../withRoot";
import styles from "../css/FindWorker.module.css";
import Typography from "../components/Typography";
import { useEffect, useState } from "react";
import axios from "axios";

function FindWorker() {
  const [workers, setWorkers] = useState([]);

  const getWorkers = async () => {
    const res = await axios.get("http://localhost:4000/workers");
    setWorkers(res.data);
  };

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
        <div className={styles.item}>
          {workers.map((worker, idx) => {
            <WorkerList nickname={worker.nickname} key={idx} />;
          })}
          <WorkerList />
        </div>
      </div>
    </div>
  );
}

export default withRoot(FindWorker);
