import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Loading from "./Loading";
import { useState } from "react";
import axios from "axios";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function FormDialog({ token, vote }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  ////////새로 구현된 선택 창
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState(false);
  const [helperText, setHelperText] = React.useState("Choose wisely");

  const handleRadioChange = (event) => {
    setValue(event.target.value);
    setHelperText(" ");
    setError(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setLoading(true);
      handleClose();
      if (value === "best") {
        // 투표에 찬성하는 경우 int 1
        const voting = {
          proposalId: vote.proposalId,
          position: 1,
        }
        const res = await axios.post("http://localhost:4000/votes/vote", voting, { headers: { authorization: token } });
        if(res.status === 200){
          window.alert("해당 안건에 대해 찬성하는 투표가 완료되었습니다.")
          setHelperText("Thank you for voting.");
          setError(false);
          handleClose();
        } else {
          window.alert("투표 트랜잭션이 실패하였습니다. 이중 투표는 Governor에 의해 거부됩니다.")
          setHelperText("Thank you for voting.");
          setError(false);
          handleClose();
        }
      } else if (value === "worst") {
        // 투표에 반대하는 경우 int 0
        const voting = {
          proposalId: vote.proposalId,
          position: 0,
        }
        const res = await axios.post("http://localhost:4000/votes/vote", voting, { headers: { authorization: token } });
        if(res.status === 200){
          window.alert("해당 안건에 대해 반대하는 투표가 완료되었습니다.")
          setHelperText("Thank you for voting.");
          setError(false);
          handleClose();
        } else {
          window.alert("투표 트랜잭션이 실패하였습니다. 투표 기간이 지났거나, 이중 투표는 Governor에 의해 거부됩니다.")
          setHelperText("Thank you for voting.");
          setError(false);
          handleClose();
        }
      } else {
        setHelperText("Please select an option.");
        setError(true);
      }
      setLoading(false);
    } catch (err) {
      window.alert("투표 트랜잭션이 실패하였습니다. 투표 기간이 지났거나, 이중 투표는 Governor에 의해 거부됩니다.")
      setHelperText("Thank you for voting.");
      setError(false);
      handleClose();
      setLoading(false);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Vote
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <div
          style={{ width: "250px", justifyContent: "center", display: "flex" }}
        >
          <h4>Please proceed to Vote</h4>
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
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <div>
          <h2>Governor 컨트랙트의 castVote 함수를 실행하여 투표에 참여할 것입니다.</h2>
          <h2>블록체인 네트워크의 환경에 따라 1~3분이 소요됩니다. 잠시만 기다려 주세요.</h2>
        </div>
        <div>
          <CircularProgress color="inherit" />
        </div>

      </Backdrop>
    </div>
  );
}
