import withRoot from "../withRoot";
import styles from "../css/CreateOrder.module.css";
import Profile from "../components/Profile";

function Createorder() {
  return (
    <div className={styles.main}>
      <div className={styles.profile}>
        <div className={styles.profileBox}>
          <Profile />
          <div className={styles.name}>name</div>
        </div>
        <div className={styles.reviewBox}>
          <div>Order Info</div>
        </div>
      </div>
    </div>
  );
}

export default withRoot(Createorder);
