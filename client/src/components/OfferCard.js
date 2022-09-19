import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "./Typography";
import { Button, CardActionArea, CardActions } from '@mui/material';

export default function OfferCard({ worker, deadline, compensation, message, chooseOffer, offer }) {
  const clickHandler = () => {
    chooseOffer(offer);
  }

  return (
    <Card sx={{ maxWidth: 345 }} style={{ marginBottom: "20px" }} >
      <CardActionArea >
        <CardMedia component="img" height="140" src={require("../img/worker1.jpg")} alt="" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" name="worker">
            {worker}
          </Typography>
          <Typography variant="body2" color="text.secondary" name="deadline">
            {deadline}
          </Typography>
          <Typography variant="body2" color="text.secondary" name="compensation">
            {compensation}
          </Typography>
          <Typography variant="body2" color="text.secondary" name="message">
            {message}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button variant="outlined" size="small" color="success" onClick={clickHandler}>
          | Pick a this Card |
        </Button>
      </CardActions>
    </Card>
  );
}
