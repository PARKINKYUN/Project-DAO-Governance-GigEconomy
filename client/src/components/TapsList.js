import React, { useState, useEffect } from "react";
import SingleTap from "./SingleTap";
import styles from "../css/Tap.module.css";
import axios from "axios";

function TapsList({ token, userInfo, worker }) {
  const [taps, setTaps] = useState([]);

  const { client_id, worker_id } = userInfo;

  useEffect(() => {
    const tapslist = getTaps();

  }, [])

  const getTaps = async () => {
    try {
      console.log("props", worker, client_id, worker_id)
      if(worker) {
        const res = await axios.get('http://localhost:4000/taps/taplistbyclient', { headers: {authorization: token} });
        const tapsInfo = res.data.data;
        if(tapsInfo !== undefined){
          const tapByWorker = tapsInfo.filter((tap) => tap.worker_id === worker.worker_id);
          setTaps(tapByWorker);
        }
      } else if(client_id) {
        const res = await axios.get('http://localhost:4000/taps/taplistbyclient', { headers: {authorization: token} });
        const tapsInfo = res.data.data;
        console.log("client tap list", tapsInfo)
        if(tapsInfo !== undefined){
          setTaps(tapsInfo);
        }
      } else if(worker_id) {
        const res = await axios.get('http://localhost:4000/taps/taplistbyworker', { headers: {authorization: token} });
        const tapsInfo = res.data.data;
        if(tapsInfo !== undefined){
          setTaps(tapsInfo);
        }
      }
    } catch (err) {
      console.error(err)
    }
  }

  // const addNewTap = (newTap) => {
  //   setTaps([newTap, ...taps]);
  // };

  return (
    <div className={styles.tapBox}>
      <ul className={styles.taps}>
        {(taps.length !== 0) ?
        taps.map((tap) => {
          return <SingleTap key={tap.tap_id} token={token} userInfo={userInfo} tap={tap} />})
        : null}
      </ul>
    </div>
  );
}

export default TapsList;
