import withRoot from "../withRoot";
import styles from "../css/FindOrder.module.css";
import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";
import OrderList from "../components/OrderList";

function FindOrder() {
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
            <OrderList
              title={"Dave"}
              text={"Hi"}
              src={require("../img/worker4.jpg")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRoot(FindOrder);
