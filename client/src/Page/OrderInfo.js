import withRoot from "../withRoot";
import styles from "../css/OrderInfo.module.css";
import Profile from "../components/Profile";
import Tap from "../components/Tap";
import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import OfferList from "../components/Offer";
import Order from "../components/Order";

function OrderInfo({ _id }) {
  const [order, setOrder] = useState({});
  const [offers, setOffers] = useState([]);
  const [offerIdx, setOfferIdx] = useState(null);

  // 오더 정보 불러오기
  const getOrder = async () =>
    axios.get(`http://localhost:4000/order_info/${id}`).then((res) => {
      setOrder(res.data);
    });

  //

  // 클라이언트가 워커의 제안을 선택하여 오더 시작
  const clientStartOrder = async () => {
    offerIdx !== null
      ? await axios.patch(`http://localhost:4000/order_info/${id}/client_start`)
      : console.log("오퍼를 선택해주세요.");
  };

  // 워커가 direct_order를 통해 생성된 오더 시작
  const workerStartOrder = async () => {
    await axios.patch(`http://localhost:4000/order_info/${id}/worker_start`);
  };

  useEffect(() => {
    getOrder();
    setOffers(order.offers);
  }, []);

  const handleDirectOrder = () => {
    if (order.status == "pending") {
      if (user == "client") {
        return <div>오더수락버튼</div>;
      }
      if (user == "worker") {
        return <div>오더삭제버튼</div>;
      }
    }
    if (order.status == "ongoing") {
      if (user == "client") {
        return null;
      }
      if (user == "worker") {
        return <div>오더연장버튼, 오더완료버튼, 오더취소버튼</div>;
      }
    }
  };
  const handlePublicOrder = () => {
    if (order.status == "pending") {
      if (user == "client") {
        return (
          <div>
            <OfferList title={offers.title} />
          </div>
        );
      }
      if (user == "worker") {
        return (
          <div>
            <OfferList />
            오퍼등록버튼
          </div>
        );
      }
    }
    if (order.status == "ongoing") {
      if (user == "client") {
        return null;
      }
      if (user == "worker") {
        return <div>오더연장버튼, 오더완료버튼, 오더취소버튼</div>;
      }
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.profile}>
        <div className={styles.profileBox}>
          <Profile />
          <div className={styles.name}>Client name</div>
        </div>
        <div className={styles.reviewBox}>
          <div>Order Info</div>
        </div>
        {order.direct_order == true ? handleDirectOrder() : handlePublicOrder()}
        <div>
          <Tap />
        </div>
      </div>
    </div>
  );
}

export default withRoot(OrderInfo);
