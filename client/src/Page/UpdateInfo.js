import React, { useEffect, useState } from "react";
import styled from "styled-components";
import styles from "../css/Tap.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdateInfo = ({ token, userInfo, isWorker, setUserInfo }) => {
  const [image, setImage] = useState(null);
  const [nickname, setNickname] = useState("");
  const [introduction, setIntroduction] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
  }, [image, nickname])

  const handleSubmit = async (e) => {
    e.preventDefault();

    // form 에 입력한 데이터를 formData 객체에 담는다.
    const formData = new FormData();
    formData.append("image", image);
    formData.append("image", nickname);
    formData.append("image", introduction);

    let email;
    if (isWorker) {
      email = userInfo.worker_id;
    } else {
      email = userInfo.client_id;
    }

    try {
      const checkInputData = await axios.post('http://localhost:4000/clients/checkNickname', { email: email, nickname: nickname });
      if (checkInputData.data.data && isWorker) {
        const res = await axios.patch("http://localhost:4000/workers/updateinfo", formData, { headers: { authorization: token } });
        if (res.status === 200) {
          window.alert("회원 정보 수정이 완료되었습니다.");
          setUserInfo({ ...userInfo, nickname: nickname, image: res.data.data, introduction: introduction });
          navigate(-1);
        } else {
          window.alert("서버 오류! 다시 시도해주세요.")
          navigate("/ReRendering");
        }
      } else if (checkInputData.data.data && !isWorker) {
        const res = await axios.patch("http://localhost:4000/clients/updateinfo", formData, { headers: { authorization: token } });
        if (res.status === 200) {
          window.alert("회원 정보 수정이 완료되었습니다.");
          setUserInfo({ ...userInfo, nickname: nickname, image: res.data.data, introduction: introduction });
          navigate(-1);
        } else {
          window.alert("서버 오류! 다시 시도해주세요.")
          navigate("/ReRendering");
        }
      } else {
        window.alert("중복되는 닉네임(Nickname)이 존재합니다.")
        navigate("/ReRendering");
      }
    } catch (err) {
      window.alert("잘못된 요청입니다.")
      navigate(-1);
    }
  }

  const handleChangeImage = (e) => {
    if (e.target.files[0].type === "image/jpeg" || e.target.files[0].type === "image/webp" || e.target.files[0].type === "image/jpg" || e.target.files[0].type === "image/png") {
      setImage(e.target.files[0]);
    } else {
      window.alert("jpeg/jpg/png 형식의 이미지 파일만 업로드 가능합니다.")
      navigate("/ReRendering");
    }
  }

  const handleChangeNickname = (e) => {
    setNickname(e.target.value);
  }

  const handleChangeIntroduction = (e) => {
    setIntroduction(e.target.value);
  }

  return (
    <Styles>
      <li className={styles.taps}>
      <form onSubmit={handleSubmit}>
      <li className={styles.taps}>
        <h1>회원 정보 수정</h1>
        <label>프로필 이미지 (Profile Image)</label>
        <input type="file" id="file" name="image" onChange={e => handleChangeImage(e)} />
        <label>닉네임 (Nickname)</label>
        <input name="nickname" value={nickname} onChange={e => handleChangeNickname(e)} />
        <label>소개 (Introduction)</label>
        <textarea name="introduction" value={introduction} placeholder="자신을 멋지게 소개해보세요." onChange={e => handleChangeIntroduction(e)} />
        <input type="submit" className="submitButton" />
        </li>
      </form>
      </li>
    </Styles>
  );
}

const Styles = styled.div`
 background: whitesmoke;
 padding: 20px;

 h1 {
   border-bottom: 1px solid white;
   color: #3d3d3d;
   font-family: sans-serif;
   font-size: 20px;
   font-weight: 600;
   line-height: 24px;
   padding: 10px;
   text-align: center;
 }

 form {
   background: whitesmoke;
   border: 0px;
   display: flex;
   flex-direction: column;
   justify-content: space-around;
   margin: 0 auto;
   max-width: 500px;
   padding: 30px 50px;
 }

 input {
   border: 0;
   border-radius: 4px;
   box-sizing: border-box;
   padding: 10px;
   width: 100%;
 }

 label {
   color: #3d3d3d;
   display: block;
   font-family: sans-serif;
   font-size: 14px;
   font-weight: 500;
   margin-bottom: 5px;
 }

 textarea {
	resize: none;
  min-height: 10rem;
  overflow-y: hidden;
  border: 0px;
  width: 100%;
 }

 .submitButton {
   background-color: black;
   color: white;
   font-family: sans-serif;
   font-size: 14px;
   margin: 20px 0px;
 }
`;

export default UpdateInfo;