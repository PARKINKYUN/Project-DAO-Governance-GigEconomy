import * as React from "react";
import ProductHero from "../view/ProductHero";
import ProductValues from "../view/ProductValues";
import { useState, useEffect } from "react";
import withRoot from "../withRoot";
import axios from "axios";

function Main() {
  // const [reviews, setReviews] = useState([]);

  // useEffect(() => {
  //   getRecentReview();
  // }, [])

  // const getRecentReview = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:4000/reviews/recentReview")
  //     setReviews(res.data.data);
  //   } catch (err) {
  //     window.alert("메인 페이지 에러. 정보가 제대로 표시되지 않습니다.")
  //   }
  // }

  return (
    <React.Fragment>
      <ProductHero />
      <ProductValues />
    </React.Fragment>
  );
}
export default withRoot(Main);
