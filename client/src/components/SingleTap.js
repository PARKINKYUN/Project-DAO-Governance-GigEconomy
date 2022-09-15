import styles from "../css/Tap.module.css";
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import NewTapForm from "./NewTapForm";
import { useState, useEffect } from "react";

function SingleTap({ token, userInfo, tap }) {
  const [userId, setUserId] = useState("");
  const [reTapState, setReTapState] = useState(false);

  useEffect(() => {
    const { client_id, worker_id } = userInfo;
    if(client_id){
      setUserId(client_id);
    } else if(worker_id){
      setUserId(worker_id);
    }
  },[])

  const changeRetapState = () => {
    if (reTapState) {
      setReTapState(false);
    } else {
      setReTapState(true);
    }
    console.log(reTapState);
  }

  return (
    <li className={styles.taps}>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          sender: {tap.writer}
        </Grid>
        <Grid item xs={8}>
          date: {tap.date}
        </Grid>
        <Grid item xs={10}>
          <div> {tap.content}</div>
        </Grid>
        <Grid item xs={2}>
          {userId !== tap.writer ? (<Button variant="contained" size="small" onClick={changeRetapState}>reTap</Button>)
          : null}
        </Grid>
      </Grid>
      {reTapState ? <NewTapForm token={token} writer={userId} client_id={tap.client_id} worker_id={tap.worker_id} />
      : null}
    </li>
  );
}

export default SingleTap;
