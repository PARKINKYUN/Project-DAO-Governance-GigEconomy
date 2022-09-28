import styles from "../css/Tap.module.css";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

// ****** props는 이대로 유지합니다. 재사용을 위해 수정하지 마세요 ******
// writer 는 접속중인 사용자의 아이디 값을 받습니다.
// order_id는 연결된 order가 있으면 넣고, 아니면 props를 안줘도 됩니다.
const NewTapForm = ({ token, writer, client_id, worker_id, order_id }) => {
  const [newTapContent, setNewTapContent] = useState("");

  const navigate = useNavigate();

  useEffect(() =>{
  }, [])

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

      const res = await axios.post("http://localhost:4000/taps/newtap", newTap, { headers: { authorization: token } });

      setNewTapContent("");
      window.alert("똑똑~! 상대에게 새로운 메시지를 전송했습니다!")
      navigate("/ReRendering");
    } catch (err) {
      console.error(err);
      window.alert("Oops!!! 메시지 전송을 실패했습니다!!!")
      navigate("/");
    }
  };

  return (
    <li className={styles.taps}>
      <Grid container spacing={2} alignItems="flex-end">
        <Grid item xs={10}>
          <input
            className={styles.newTapContent}
            value={newTapContent}
            onChange={onTextChange}
            placeholder="여기에 메시지를 남겨주세요."
          />
        </Grid>
        <Grid item xs={2} >
          <Button variant="contained" size="small" onClick={onSubmit}>Submit</Button>
        </Grid>
      </Grid>
    </li>
  );
}

export default NewTapForm;