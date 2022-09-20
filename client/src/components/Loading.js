import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

export default function SimpleBackdrop(transactionEvent) {
  const [open, setOpen] = React.useState(false);

  const handleToggle = () => {
    setOpen(!open);
    transactionEvent(); ////////// props로 전송한 함수가 실행되는 동안 로딩 화면
    setOpen(!open)
  };

  return (
    <div>
      <Button onClick={handleToggle}>Show backdrop</Button>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}