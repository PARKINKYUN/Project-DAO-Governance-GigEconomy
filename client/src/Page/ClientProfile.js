import withRoot from "../withRoot";
import styles from "../css/WorkerProfile.module.css";
import Profile from "../components/Profile";
import Tap from "../components/Tap";


// client에 맞게 내용 모두 수정해야함
//
//
//
function ClientProfile() {
  return (
    <div className={styles.main}>
      <div className={styles.profile}>
        <div className={styles.profileBox}>
          <Profile />
          <div className={styles.name}>name</div>
        </div>
        <div className={styles.reviewBox}>
          <div>Worker Review</div>
        </div>
        <div>
          <Tap />
        </div>
      </div>
    </div>
  );
}

export default withRoot(ClientProfile);