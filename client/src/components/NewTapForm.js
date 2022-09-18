import styles from "../css/Tap.module.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

// ****** props는 이대로 유지합니다. 재사용을 위해 수정하지 마세요 ******
// writer 는 접속중인 사용자의 아이디 값을 받습니다.
// order_id는 연결된 order가 있으면 넣고, 아니면 props를 안줘도 됩니다.
const NewTapForm = ({ token, writer, client_id, worker_id, order_id }) => {
  const [newTapContent, setNewTapContent] = useState("");

  const navigate = useNavigate();

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

      const res = await axios.post(
        "http://localhost:4000/taps/newtap",
        newTap,
        { headers: { authorization: token } }
      );

      setNewTapContent("");
      window.alert("똑똑~! 상대에게 새로운 메시지를 전송했습니다!")
      // 클라이언트나 워커 인포에서 진입할 때는 전혀 다른 페이지로 가게 된다...ㅠㅠ
      // 클라이언트와 워커 인포에 있는 플래그를 프랍스로 가져와서 분기에 따라 다르게 보여지는 로직을 선택해야 할 듯...
      // window.location.reload();
      // navigate(-1);
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