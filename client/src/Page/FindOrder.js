import * as React from "react";
import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import OrderCard from "../components/OrderCard";
import axios from "axios";
import withRoot from "../withRoot";
import styles from "../css/FindOrder.module.css";
import Link from "@mui/material/Link";
import { Grid } from "@mui/material";

function FindOrder( token ) {
  const [orders, setOrders] = useState([]);

  const getOrders = async () =>
    await axios
      .get("http://localhost:4000/orders")
      .then((res) => {
        setOrders(res.data.data);
      })
      .catch((err) => console.error(err));

  useEffect(() => {
    console.log("findorder 페이지 props 정보", token)
    getOrders();
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.orderlist}>
        <div className={styles.header}>
          <div className={styles.text}>Order List</div>
          <Link component={RouterLink} to="/createorder">
            New Order
          </Link>
        </div>
        <div className={styles.container}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {orders.map((order) => {
              return (
                <Grid item xs={2} sm={4} md={3} key={order._id}>
                  <OrderCard
                    order={order}
                    key={order._id}
                    token={token}
                  />
                </Grid>
              );
            })}
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default withRoot(FindOrder);
