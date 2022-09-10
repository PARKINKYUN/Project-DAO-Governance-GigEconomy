import withRoot from "../withRoot";
import styles from "../css/OrderInfo.module.css";
import Profile from "../components/Profile";
import Tap from "../components/Tap";

function OrderInfo() {
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
        <div>
          <Tap />
        </div>
      </div>
    </div>
  );
}

export default withRoot(OrderInfo);
