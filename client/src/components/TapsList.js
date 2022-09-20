import React, { useEffect } from "react";
import SingleTap from "./SingleTap";
import styles from "../css/Tap.module.css";

const TapsList = ({ token, userInfo, taps, order }) => {
  useEffect(() => {

  }, [taps])

  return (
    <div className={styles.tapBox}>
      <ul className={styles.taps}>
        {(taps.length !== 0) ?
        taps.map((tap) => {
          return <SingleTap key={tap.tap_id} token={token} userInfo={userInfo} tap={tap} order={order} />})
        : null}
      </ul>
    </div>
  );
}

export default TapsList;
