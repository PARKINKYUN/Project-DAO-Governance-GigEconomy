import WorkerCard from "../components/WorkerList";
import withRoot from "../withRoot";
import styles from "../css/FindWorker.module.css";
import Typography from "../components/Typography";
import { useEffect, useState } from "react";
import React, { useReducer } from "react";
import axios from "axios";

function FindWorker({ token, userInfo }) {
  const reducer = (state, action) => {
    return [...state, ...action];
  };
  const [state, dispatch] = useReducer(reducer, []);
  // const [workers, setWorkers] = useState([]);

  const getWorkers = async () => {
    const res = await axios.get("http://localhost:4000/workers");
    // setWorkers(res.data.data);
    dispatch(res.data.data);
    console.log(res.data.data);
  };

  useEffect(() => {
    getWorkers();
    console.log("========================", state);
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
            <WorkerCard
              worker={worker}
              token={token}
              userInfo={userInfo}
              key={idx}
            />;
          })}
          {/* <WorkerCard worker_id={"test002@gig.com"} nickname={"worker"} /> */}
        </div>
      </div>
    </div>
  );
}

export default withRoot(FindWorker);
