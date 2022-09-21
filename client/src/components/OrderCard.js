import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "./Typography";
import { CardActionArea } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

export default function OrderCard({ order, token, userInfo, isWorker, image }) {
  console.log(image, "오더카드 이미지 부분")

  return (
    <Link component={RouterLink} to="/OrderInfo" state={{ order, token, userInfo, isWorker, image }}>
      <Card sx={{ maxWidth: 345 }} style={{ marginBottom: "20px" }}>
        <CardActionArea>
          <CardMedia component="img" height="140" src={"http://localhost:4000/images/" + image} alt="" />
          <CardContent>
            <Typography gutterBottom variant="subtitle2" component="div">
              {order.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Client: {order.client_id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Deadline: {order.deadline}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Compensation: {order.compensation}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}
