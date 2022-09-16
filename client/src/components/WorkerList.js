import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "./Typography";
import { CardActionArea } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

export default function WorkerCard({ worker, userInfo, token }) {
  const navigate = useNavigate();
  React.useEffect(() => {
    console.log(worker);
  });
  const onClick = () => {
    navigate("/workerprofile", {
      state: {
        worker: worker,
        userInfo: userInfo,
        token: token,
      },
    });
  };
  return (
    // <Link
    //   component={RouterLink}
    //   state={{ worker, token, userInfo }}
    //   to="/workerprofile"
    // >
    <div onClick={onClick}>
      <Card sx={{ maxWidth: 345 }} style={{ marginBottom: "20px" }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="140"
            src={require("../img/hj.jpeg")}
            alt=""
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {/* {worker.nickname} */}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              hi
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </div>
    //</Link>
  );
}
