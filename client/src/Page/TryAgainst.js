import React, { useEffect, useState } from "react";
import styled from "styled-components";
import styles from "../css/Tap.module.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const TryAgainst = ({ token, userInfo, isWorker }) => {
    const [image, setImage] = useState(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const navigate = useNavigate();
    const location = useLocation();
    const { order_id, estimation_id } = location.state;

    useEffect(() => {
    }, [image, title, content])

    const handleSubmit = async (e) => {
        e.preventDefault();

        // form 에 입력한 데이터를 formData 객체에 담는다.
        const formData = new FormData();
        formData.append("image", image);
        formData.append("image", title);
        formData.append("image", content);
        formData.append("image", order_id);
        formData.append("image", estimation_id);

        try {
            const res = await axios.post("http://localhost:4000/tryagainst/newTryAgainst", formData, { headers: { authorization: token } });
            if (res.status === 200) {
                window.alert("이의 제기 신청이 완료되었습니다.");
                navigate(-1);
            } else {
                window.alert("서버 오류! 다시 시도해주세요.")
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

    const handleChangeTitle = (e) => {
        setTitle(e.target.value);
    }

    const handleChangeContent = (e) => {
        setContent(e.target.value);
    }

    return (
        <Styles>
            {isWorker ?
                <li className={styles.taps}>
                    <form onSubmit={handleSubmit}>
                        <li className={styles.taps}>
                            <h1>Try objection</h1>
                            <label>참고 자료 (Evidence Image)</label>
                            <input type="file" id="file" name="image" onChange={e => handleChangeImage(e)} />
                            <label>제목 (Title)</label>
                            <input name="title" value={title} onChange={e => handleChangeTitle(e)} />
                            <label>내용 (objection Content)</label>
                            <textarea name="content" value={content} placeholder="구체적인 내용을 적어주세요." onChange={e => handleChangeContent(e)} />
                            <input type="submit" className="submitButton" />
                        </li>
                    </form>
                </li>
                : null}
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

export default TryAgainst;