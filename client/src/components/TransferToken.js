import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import InputBase from '@mui/material/InputBase';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
        color: '#ff3d47',
    },
});

const BootstrapInput = styled(InputBase)(({ theme }) => ({
    'label + &': {
        marginTop: theme.spacing(3),
    },
    '& .MuiInputBase-input': {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '10px 26px 10px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}));

export default function TransferToken({ token, isWorker, isLoading }) {
    const [open, setOpen] = useState(false);
    const [selectBox, setSelectBox] = React.useState('');
    const [identifier, setIdentifier] = React.useState("");
    const [amount, setAmount] = React.useState();
    const [loading, setLoading] = React.useState(false);

    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const changeSelectBox = (e) => {
        setSelectBox(e.target.value);
    }

    const changeIdentifier = (e) => {
        setIdentifier(e.target.value);
    };

    const handleAmount = (e) => {
        setAmount(parseInt(e.target.value));
    }

    const transferToken = async () => {
        try {
            let transferInfo;
            if (selectBox === "ID") {
                transferInfo = { userId: identifier, amount: amount, isWorker: isWorker };
            } else if (selectBox === "Nickname") {
                transferInfo = { userNickname: identifier, amount: amount, isWorker: isWorker };
            } else {
                return window.alert("잘못된 입력입니다. ID 또는 Nickname을 선택해주세요.")
            }
            setOpen(false);

            console.log(identifier, "님에게 토큰 ", amount, "을 전송합니다.")
            setLoading(true);
            const res = await axios.post("http://localhost:4000/transfers/user", transferInfo, { headers: { authorization: token } });
            setLoading(false);
            if (res.status === 200) {
                window.alert("토큰 전송이 정상적으로 처리되었습니다.")
                setSelectBox("");
                setIdentifier("");
                setAmount(0);
                navigate("/ReRendering")
            } else if (res.status === 405) {
                window.alert("실행 오류! 토큰 잔액이 보내는 양보다 더 적습니다.")
                setAmount(0);
            } else {
                window.alert("전송 오류가 발생했습니다. 다시 시도해주세요");
                setAmount(0);
            }
        } catch (err) {
            window.alert("전송 오류가 발생했습니다. 다시 시도해주세요");
            setAmount(0);
        }
    }

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>
                토큰 전송
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Token Transfer</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        토큰을 전송할 상대방의 <b>ID 또는 Nickname</b>과 <b>보내는 토큰의 양</b>을 정확하게 입력해주세요.
                    </DialogContentText>
                    <Box
                        sx={{
                            '& > legend': { mt: 2 },
                        }}
                    >
                        <div>
                            <FormControl sx={{ m: 1 }} variant="standard">
                                <InputLabel htmlFor="demo-customized-select-native">ID or Nickname</InputLabel>
                                <NativeSelect
                                    id="demo-customized-select-native"
                                    value={selectBox}
                                    onChange={changeSelectBox}
                                    input={<BootstrapInput />}
                                >
                                    <option aria-label="None" value="" />
                                    <option>ID</option>
                                    <option>Nickname</option>
                                </NativeSelect>
                            </FormControl>
                            <FormControl sx={{ m: 1 }} variant="standard">
                                <InputLabel htmlFor="demo-customized-textbox">{selectBox}</InputLabel>
                                <BootstrapInput id="demo-customized-textbox" value={identifier} onChange={changeIdentifier} />
                            </FormControl>
                            <FormControl sx={{ m: 1 }} variant="standard">
                                <InputLabel htmlFor="demo-customized-textbox">Amount</InputLabel>
                                <BootstrapInput id="demo-customized-textbox" value={amount} onChange={handleAmount} />
                            </FormControl>
                        </div>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={transferToken}>Transfer</Button>
                </DialogActions>
            </Dialog>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <div>
                    <h2>블록체인 네트워크에 트랜잭션을 보내는 중입니다.</h2>
                    <h2>잠시만 기다려 주세요.</h2>
                </div>
                <div>
                    <CircularProgress color="inherit" />
                </div>
                
            </Backdrop>
        </div>
    );
}