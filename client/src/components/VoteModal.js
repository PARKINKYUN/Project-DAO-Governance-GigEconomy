import * as React from "react";
import Button from "@mui/material/Button";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";

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
  ////////새로 구현된 선택 창
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("Choose wisely");

  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setHelperText(" ");
    setError(false);
  };
  const handleSubmit = (event) => {
    event.preventDefault();

    if (value === "best") {
      setHelperText("Thank you for voting.");
      setError(false);
      handleClose();
    } else if (value === "worst") {
      setHelperText("Thank you for voting.");
      setError(true);
      handleClose();
    } else {
      setHelperText("Please select an option.");
      setError(true);
    }
  };
  ////

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
          <form onSubmit={handleSubmit}>
            <FormControl sx={{ m: 3 }} error={error} variant="standard">
              <RadioGroup
                aria-labelledby="demo-error-radios"
                name="quiz"
                value={value}
                onChange={handleRadioChange}
              >
                <FormControlLabel
                  value="best"
                  control={<Radio />}
                  label="Agree"
                />
                <FormControlLabel
                  value="worst"
                  control={<Radio />}
                  label="Disagree"
                />
              </RadioGroup>
              <FormHelperText>{helperText}</FormHelperText>
              <Button sx={{ mt: 1, mr: 1 }} type="submit" variant="outlined">
                Submit
              </Button>
            </FormControl>
          </form>
        </DialogActions>
      </Dialog>
    </div>
  );
}
