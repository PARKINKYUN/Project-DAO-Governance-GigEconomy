import React, { useState } from "react";
import NewTapForm from "./NewTapForm";
import SingleTap from "./SingleTap";
import styles from "../css/Tap.module.css";

function Tap() {
  const [taps, setTaps] = useState([]);

  const addNewTap = (newTap) => {
    setTaps([newTap, ...taps]);
  };

  return (
    <div className={styles.tapBox}>
      <ul className={styles.taps}>
        {taps.map((t) => (
          <SingleTap key={t.uuid} writer={t.writer} date={t.date}>
            {t.content}
          </SingleTap>
        ))}
      </ul>
      <NewTapForm onButtonClick={addNewTap} />
    </div>
  );
}

export default Tap;
