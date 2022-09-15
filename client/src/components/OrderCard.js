import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "./Typography";
import { CardActionArea } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import Link from "@mui/material/Link";

export default function OrderCard({
  id,
  client_id,
  title,
  category,
  deadline,
  compensation,
}) {
  return (
    <Link component={RouterLink} to="/OrderInfo" state={{ id }}>
      <Card sx={{ maxWidth: 345 }} style={{ marginBottom: "20px" }}>
        <CardActionArea>
          {/* <CardMedia component="img" height="140" src={src} alt="" /> */}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Client: {client_id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Deadline: {deadline}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Compensation: {compensation}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  );
}
