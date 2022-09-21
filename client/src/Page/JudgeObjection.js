import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from "../css/Tap.module.css";
import Objection from "../components/Objection";

const PastOrdersListByWorker = ({ token, userInfo }) => {
    const [tries, setTries] = useState([]);
    const [orders, setOrders] = useState([]);
    const [estimations, setEstimations] = useState([]);
    const [updateNow, setUpdateNow] = useState(true);

    const navigate = useNavigate();

    // 부모 컴포넌트 리렌더링을 위한 후크
    const updateFunc = () => {
        setUpdateNow(!updateNow)
    }

    useEffect(() => {
        if (!userInfo.mod_authority) {
            window.alert("해당 페이지는 Moderator만 접근 가능합니다.");
            navigate(-1);
        }
        getOnBoardTry();
        getEstimatedOrder();
        getEvaluation();
    }, [])

    const getOnBoardTry = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/tryagainst/getOnBoardTry`, { headers: { authorization: token } });
            setTries(res.data.data);
        } catch (err) {
            console.error(err);
            window.alert("Order 목록을 불러오는데 실패했습니다. 다시 시도해주세요.");
            navigate(-1);
        }
    }

    const getEstimatedOrder = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/orders/getEstimatedOrder`, { headers: { authorization: token } });
            setOrders(res.data.data);
        } catch (err) {
            console.error(err);
            window.alert("Order 목록을 불러오는데 실패했습니다. 다시 시도해주세요.");
            navigate(-1);
        }
    }

    const getEvaluation = async () => {
        try {
            const res = await axios.get(`http://localhost:4000/estimate/getTryingEstimations`, { headers: { authorization: token } });
            setEstimations(res.data.data);
        } catch (err) {
            console.error(err);
            window.alert("평가 목록을 불러오는데 실패했습니다. 다시 시도해주세요.");
            navigate(-1);
        }
    }

    return (
        <div style={{ padding: "10px" }}>
            <div style={{ borderBottom: "1px solid black", padding: "10px" }}>
                <div>
                    <h3>Judge Objection Carefully</h3>
                </div>
                <li className={styles.taps}>
                    {tries.length !== 0 ?
                        (tries.map((tryitem, idx) => {
                            const panel = "panel" + idx;
                            return <Objection key={idx} panel={panel} token={token} orders={orders} estimations={estimations} tryitem={tryitem} updateFunc={updateFunc} />
                        }))
                    : null}
                </li>
            </div>
        </div>
    );
}

export default PastOrdersListByWorker;