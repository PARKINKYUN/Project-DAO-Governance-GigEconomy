import withRoot from "../withRoot";
import styles from "../css/WorkerProfile.module.css";
import Profile from "../components/Profile";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import TapsList from "../components/TapsList";
import NewTapForm from "../components/NewTapForm";
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

function WorkerProfile() {
  const [tap, setTap] = useState(false);
  
  const location = useLocation();
  const { worker, userInfo, token } = location.state;

  const onClick = () => {
    setTap((hidden) => !hidden);
  };

  useEffect(() => {   
  }, []);

  return (
    <div className={styles.main}>
      <div className={styles.profile}>
        <div className={styles.profileBox}>
          <Profile />
          <div className={styles.name}>name: {worker.nickname}</div>
          <div className={styles.toolBox}>
            <div>
              <Link
                component={RouterLink}
                to="/directeorder"
                state={{ workerId: null }}
              >
                Direct Order
              </Link>
            </div>
            <div>
              <button onClick={onClick}>Tap</button>
            </div>
          </div>
        </div>
        <div className={styles.reviewBox}>
          <div>Worker Review</div>
        </div>
        <div>
          <TapsList token={token} userInfo={userInfo} worker={worker} />
        </div>
        <div>
          {tap ? (
            <NewTapForm
              token={token}
              writer={userInfo.client_id}
              client_id={userInfo.client_id}
              worker_id={worker.worker_id}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default withRoot(WorkerProfile);
