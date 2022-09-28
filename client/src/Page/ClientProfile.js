import withRoot from "../withRoot";
import styles from "../css/WorkerProfile.module.css";
import Profile from "../components/Profile";
import TapsList from "../components/TapsList";


// 
// 사용안함...삭제할 페이지
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
          <TapsList />
        </div>
      </div>
    </div>
  );
}

export default withRoot(ClientProfile);