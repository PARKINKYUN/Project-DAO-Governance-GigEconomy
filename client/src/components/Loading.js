import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

export default function Loading() {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const handleToggle = () => {
    setOpen(!open);
  };

  return (
    <div>
      <Button onClick={handleToggle}>Show backdrop</Button>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
        onClick={handleClose}
      >
        <div>
          <h2>블록체인 네트워크로부터 데이터를 읽어오고 있습니다.</h2>
          <h2>잠시만 기다려주세요.</h2>
        </div>
        <div>
          <CircularProgress color="inherit" />
        </div>
      </Backdrop>
    </div>
  );
}