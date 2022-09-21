import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import styles from "../css/Tap.module.css";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const ReviewsList = () => {
    const [reviews, setReviews] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const { token, userInfo } = location.state;

    useEffect(() => {
        getReviews();
    }, [])

    const getReviews = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/reviews/reviewlistbyworker/${userInfo.worker_id}`, { headers: { authorization: token } });
            console.log(res.data.data)
            setReviews(res.data.data);
        } catch (err) {
            console.error(err);
            window.alert("리뷰 목록을 불러오는데 실패했습니다. 다시 시도해주세요.");
            navigate(-1);
        }
    }

    return (
        <div>
            <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
                <div>
                    <h3>{`${userInfo.nickname}의 Review`}</h3>
                </div>
                <li className={styles.taps}>
                    {reviews.length !== 0 ?
                    (reviews.map((review) => {
                        return (
                            <Accordion key={review._id}>
                                <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography><h5>Order Title : {review.order_title}</h5></Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        {review.content}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        )
                    }))
                    : null }
                </li>
            </div>
        </div>
    );
}

export default ReviewsList;