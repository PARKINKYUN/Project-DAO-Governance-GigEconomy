import * as React from "react";
import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import OrderCard from "../components/OrderCard";
import axios from "axios";
import withRoot from "../withRoot";
import styles from "../css/FindOrder.module.css";
import Link from "@mui/material/Link";
import Typography from "../components/Typography";

function FindOrder() {
  const [orders, setOrders] = useState([]);

  const getOrders = async () =>
    await axios
      .get("http://localhost:4000/orders", {})
      .then((res) => {
        setOrders(res.data.data);
        console.log(orders);
      })
      .catch((err) => console.error(err));

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.orderlist}>
        <div className={styles.header}>
          <div className={styles.text}>Order List</div>
          <Link
            component={RouterLink}
            to="/createorder"
            state={{ workerId: null }}
          >
            New Order
          </Link>
        </div>
        <div className={styles.container}>
          <div className={styles.item}>
            {orders.map((order) => {
              const {
                _id,
                client_id,
                title,
                category,
                deadline,
                compensation,
              } = order;
              <OrderCard
                client_id={client_id}
                title={title}
                category={category}
                deadline={deadline}
                compensation={compensation}
              />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRoot(FindOrder);
