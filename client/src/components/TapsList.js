import React, { useState, useEffect } from "react";
import NewTapForm from "./NewTapForm";
import SingleTap from "./SingleTap";
import styles from "../css/Tap.module.css";
import axios from "axios";

function TapsList({ token, order_id, client_id, worker_id }) {
  const [taps, setTaps] = useState([]);

  useEffect(async () => {
    const tapslist = getTaps();
    setTaps(tapslist);
  }, [])

  const getTaps = async () => {
    try {
      if(order_id) {
        const res = await axios.get('http://localhost:4000/taps/taplistbyorder', { headers: token, params:order_id });

      } else if(client_id) {
        const res = await axios.get('http://localhost:4000/taps/taplistbyclient', { headers: token });

      } else if(worker_id) {
        const res = await axios.get('http://localhost:4000/taps/taplistbyworker', { headers: token });

      }

    } catch (err) {
      console.error(err)
    }
  }

  const addNewTap = (newTap) => {
    setTaps([newTap, ...taps]);
  };

  return (
    <div className={styles.tapBox}>
      <ul className={styles.taps}>
        {taps.map((tap) => (
          <SingleTap key={tap.tap_id} writer={tap.writer} date={tap.createdAt}>
            {tap.content}
          </SingleTap>
        ))}
      </ul>
      <NewTapForm token={token} client_id={client_id} worker_id={worker_id} order_id={order_id} onButtonClick={addNewTap} />
    </div>
  );
}

export default TapsList;
