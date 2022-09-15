import styles from "../css/Tap.module.css";
import React, { useState, useEffect } from "react";
import axios from "axios";

// ****** props는 이대로 유지합니다. 재사용을 위해 수정하지 마세요 ******
// writer 는 접속중인 사용자의 아이디 값을 받습니다.
// order_id는 연결된 order가 있으면 넣고, 아니면 props를 안줘도 됩니다.
function NewTapForm({ token, writer, client_id, worker_id, order_id }) {
  const [newTapContent, setNewTapContent] = useState("");

  // let reciever;
  // let newTap;
  // useEffect(()=>{
  //   if(writer !== client_id){
  //     reciever = client_id;
  //   } else if(writer !== worker_id) {
  //     reciever = worker_id;
  //   }
  // }, [])

  const onTextChange = (e) => {
    setNewTapContent(e.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (newTapContent === "") {
        return;
      }
      const newTap = {
        writer: writer,
        client_id: client_id,
        worker_id: worker_id,
        content: newTapContent,
        order_id: order_id,
      };
      
      const res = await axios.post('http://localhost:4000/taps/newtap', newTap, {headers: {authorization: token}});
      console.log(res.data.message)
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
        placeholder=""
      />
      <button className={styles.submitNewTap}>submit</button>
    </form>
  );
}

export default NewTapForm;
