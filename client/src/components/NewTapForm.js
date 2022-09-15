import styles from "../css/Tap.module.css";
import React, { useState } from "react";
import axios from "axios";

function NewTapForm({ token, writer, client_id, order_id, worker_id, onButtonClick }) {
  const [newTapContent, setNewTapContent] = useState({});

  const onTextChange = (e) => {
    setNewTapContent(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get('http://localhost:4000/taps/getlatesttapnum');
      const latestTapId = res.data.data.tap_id;
      if (newTapContent === "") {
        return;
      }
      const newTap = {
        tap_id: latestTapId + 1,
        writer: writer,
        client_id: client_id,
        worker_id: worker_id,
        content: newTapContent,
        order_id: order_id,
      };
      await axios.post('http://localhost:4000/taps/newtap', newTap, {headers: {authorization: token}});
      onButtonClick(newTap);
      setNewTapContent("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className={styles.writingArea} onSubmit={onSubmit}>
      <input
        className={styles.newTapContent}
        value={newTapContent}
        onChange={onTextChange}
        placeholder="Write here..."
      ></input>
      <button className={styles.submitNewTap}>submit</button>
    </form>
  );
}

export default NewTapForm;
