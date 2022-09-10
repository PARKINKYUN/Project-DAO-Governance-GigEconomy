import styles from "../css/Tap.module.css";
import React, { useState } from "react";

function NewTapForm({ onButtonClick }) {
  const [newTapContent, setNewTapContent] = useState("");

  const onTextChange = (e) => {
    setNewTapContent(e.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (newTapContent === "") {
      return;
    }
    let newTap = {
      uuid: Math.floor(Math.random() * 10000),
      date: new Date().toISOString().substring(0, 10),
      content: newTapContent,
    };
    onButtonClick(newTap);
    setNewTapContent("");
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
