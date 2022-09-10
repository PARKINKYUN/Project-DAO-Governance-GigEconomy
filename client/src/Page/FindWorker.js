import WorkerList from "../components/WorkerList";
import withRoot from "../withRoot";
import styles from "../css/FindWorker.module.css";
import Typography from "../components/Typography";

function FindWorker() {
  return (
    <div>
      <div className={styles.head}>
        <Typography variant="h3" gutterBottom marked="center" align="center">
          Worker List
        </Typography>
      </div>
      <div className={styles.container}>
        <div className={styles.item}>
          <WorkerList
            title={"Dave"}
            text={"Hi"}
            src={require("../img/worker1.jpg")}
          />
        </div>
        <div className={styles.item}>
          <WorkerList
            title={"Dave"}
            text={"Hi"}
            src={require("../img/worker2.jpg")}
          />
        </div>
        <div className={styles.item}>
          <WorkerList
            title={"Dave"}
            text={"Hi"}
            src={require("../img/worker3.jpg")}
          />
        </div>
        <div className={styles.item}>
          <WorkerList
            title={"Dave"}
            text={"Hi"}
            src={require("../img/worker4.jpg")}
          />
        </div>
        <div className={styles.item}>
          <WorkerList
            title={"Dave"}
            text={"Hi"}
            src={require("../img/worker5.jpg")}
          />
        </div>
        <div className={styles.item}>
          <WorkerList
            title={"Dave"}
            text={"Hi"}
            src={require("../img/worker6.jpg")}
          />
        </div>
      </div>
    </div>
  );
}

export default withRoot(FindWorker);
