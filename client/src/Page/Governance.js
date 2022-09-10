import withRoot from "../withRoot";
import styles from "../css/Governance.module.css";

function Governance() {
  return (
    <div className={styles.main}>
      <div className={styles.vote}>
        <div className={styles.voteBox}>
          <div className={styles.name}>Vote Result</div>
        </div>
        <div className={styles.proposals}>
          <div>Recent Proposals</div>
        </div>
        <div>
          <span>Updated Policy</span>
        </div>
      </div>
    </div>
  );
}

export default withRoot(Governance);
