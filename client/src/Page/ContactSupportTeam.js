import withRoot from "../withRoot";
import styles from "../css/WorkerProfile.module.css";
import Profile from "../components/Profile";
import TapsList from "../components/TapsList";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import OrderCard from "../components/OrderCard";
import { useState, useEffect } from "react";
import axios from "axios";
import NewTapForm from "../components/NewTapForm";

function ContactSupportTeam({ token, userInfo, worker_id  }) {
  const [taps, setTaps] = useState([]);


  useEffect(() => {
    const getTaps = async () => {
      const res = await axios.get(
        "http://localhost:4000/taps/taplistbyworker",
        { headers: { authorization: token } }
      );
      const tapsInfo = res.data.data;
      if (tapsInfo !== undefined) {
        setTaps(tapsInfo);
      }
    };
    getTaps();

    {
      taps.map((worker) => {
        return <Grid item xs={2} sm={4} md={3} key={worker._id}></Grid>;
      });
    }
  }, [ token, userInfo, worker_id ]);

  return (
    <div style={{ padding: "10px" }}>
      <div style={{ borderBottom: "", padding: "10px" }}>
        <div>
          <h3>Contact Support Team</h3>
        </div>

        <Grid container spacing={3}>
          {" "}
        </Grid>
      </div>
      <div>
      {(taps && Worker) ?
          
          <NewTapForm token={token} writer={worker_id} worker_id={worker_id} />
          :
          null
        }
      </div>
      <div>
        <TapsList token={token} userInfo={userInfo} taps={taps} />
      </div>
    </div>
  );
}


export default withRoot(ContactSupportTeam);
