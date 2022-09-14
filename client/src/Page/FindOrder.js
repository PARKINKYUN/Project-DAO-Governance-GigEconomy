import * as React from "react";
import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import Order from "../components/Order";
import axios from "axios";
import withRoot from "../withRoot";
import styles from "../css/FindOrder.module.css";
import Link from "@mui/material/Link";

function FindOrder() {
  const [orders, setOrders] = useState([]);

  const getOrders = async () =>
    await axios
      .get("http://localhost:4000/orders", {})
      .then((res) => {
        setOrders(res.data);
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
          <button>
            <Link component={RouterLink} to="/createorder">
              Create Order
            </Link>
          </button>
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
              <Order
                id={_id}
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
