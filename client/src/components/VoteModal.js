import * as React from "react";
import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";

import DialogTitle from "@mui/material/DialogTitle";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function FormDialog({
  token,
  worker_id,
  order_id,
  order_title,
}) {
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");

  const navigate = useNavigate();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  //
  //
  //  컨트랙트 배포 후 구현

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Vote
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <div
          style={{ width: "250px", justifyContent: "center", display: "flex" }}
        >
          <h4>please proceed to vote</h4>
        </div>

        <DialogActions style={{ justifyContent: "center" }}>
          <Button onClick={handleClose}>agree</Button>
          <Button onClick={handleClose}>disagree</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
