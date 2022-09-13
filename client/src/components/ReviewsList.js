import axios from "axios";
import { useState, useEffect } from "react";
import Review from "./Review";

const ReviewsList = () => {
    const [reviews, setReviews ] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        reviewData();
    }, [])

    const reviewData = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/review");
            setReviews(res.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <>
        {loading===false ? (reviews.map((review, idx) => {
            return <Review review={review} key={idx} />
        })) : 
        (<h1>최근 Review를 읽어오고 있습니다.</h1>)}
        </>
    )
}

export default ReviewsList;