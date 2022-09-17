import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "./Typography";
import { CardActionArea } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

export default function WorkerList({ worker }) {
  return (
    <Link component={RouterLink} state={{ worker }} to="/workerprofile">
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
              <b>{worker.nickname}</b>
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}
