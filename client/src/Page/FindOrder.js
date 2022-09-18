import * as React from "react";
import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import OrderCard from "../components/OrderCard";
import axios from "axios";
import withRoot from "../withRoot";
import styles from "../css/FindOrder.module.css";
import Link from "@mui/material/Link";
import { Grid } from "@mui/material";

function FindOrder( token, userInfo, isWorker ) {
  const [orders, setOrders] = useState([]);

  const getOrders = async () =>
    await axios
      .get("http://localhost:4000/orders")
      .then((res) => {
        console.log(res.data.data);
        setOrders(res.data.data);
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
                <Grid item xs={2} sm={4} md={4} key={order._id}>
                  <OrderCard
                    order={order}
                    key={order._id}
                    token={token}
                    userInfo={userInfo}
                    isWorker={isWorker}
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
