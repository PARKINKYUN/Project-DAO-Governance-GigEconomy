import withRoot from "../withRoot";
import TapsList from "../components/TapsList";
import Grid from "@mui/material/Grid";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import NewTapForm from "../components/NewTapForm";

function ContactSupportTeam() {
  const [taps, setTaps] = useState([]);

  const location = useLocation();
  const { token, userInfo } = location.state;

  useEffect(() => {
    if(userInfo.worker_id === "admin01@gig.com"){
      getTapsByAdmin();
      userInfo.client_id = "admin01@gig.com";
      userInfo.worker_id = null;
    } else {
      getTapsbyWorker();
    }
  }, []);

  const getTapsByAdmin = async () => {
    try {
      const res = await axios.get("http://localhost:4000/taps/taplistbyadmin", { headers: { authorization: token } });
      setTaps(res.data.data);
    } catch (err) {
      console.error(err);
    }
  }

  const getTapsbyWorker = async () => {
    try {
      const res = await axios.get("http://localhost:4000/taps/taplistbyworker", { headers: { authorization: token } });
      const myTaps = res.data.data;
      const myTapsWithAdmin = myTaps.filter((tap) => {
        return tap.client_id === "admin01@gig.com" || tap.worker_id === "admin01@gig.com"
      })
      setTaps(myTapsWithAdmin);
    } catch (err) {
      window.alert("서버로부터 최근 대화기록을 가져오는데 실패했습니다. 다시 시도해주세요.")
    }
  }

  return (
    <div style={{ padding: "10px" }}>
      <div style={{ borderBottom: "", padding: "10px" }}>
        <div>
          <h3>Contact Support Team</h3>
        </div>

        <Grid container spacing={3}>

        </Grid>
      </div>
      <div>
        {userInfo.client_id === "admin01@gig.com" ?
        null        
        :
        <NewTapForm token={token} writer={userInfo.worker_id} worker_id={userInfo.worker_id} client_id="admin01@gig.com" />
        }
          
      </div>
      <div>
        <TapsList token={token} userInfo={userInfo} taps={taps} />
      </div>
    </div>
  );
}


export default withRoot(ContactSupportTeam);
