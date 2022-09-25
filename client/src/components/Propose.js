import * as React from 'react';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import axios from 'axios';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import InputBase from '@mui/material/InputBase';
import Rating from '@mui/material/Rating';
import { useNavigate } from 'react-router-dom';

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

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function Propose({ proposal }) {
    const [open, setOpen] = React.useState(false);
    const [contract, setContract] = useState("");
    const [values, setValues] = useState([0]);
    const [method, setMethod] = useState([]);
    const [param1, setParam1] = useState("");
    const [param2, setParam2] = useState("");
    const [param3, setParam3] = useState(0);
    const [param4, setParam4] = useState(0);
    const [description, setDescription] = useState("");
    const [loading, setLoading] = React.useState(false);

    const navigate = useNavigate();

    const handleContract = (e) => {
        setContract(e.target.value);
    }

    const handleValues = (e) => {
        setValues(e.target.value);
    }

    const handleMethods = (e) => {
        setMethod(e.target.value);
    }

    const handleParam1 = (e) => {
        setParam1(e.target.value);
    }

    const handleParam2 = (e) => {
        setParam2(e.target.value);
    }

    const handleParam3 = (e) => {
        setParam3(parseInt(e.target.value));
    }

    const handleParam4 = (e) => {
        setParam4(parseInt(e.target.value));
    }

    const handleDescription = (e) => {
        setDescription(e.target.value);
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async () => {
        try {
            let valueArray = values;
            let paramArray = [];
            if (param1 !== "") {
                paramArray.push(param1);
            }
            if (param2 !== "") {
                paramArray.push(param2);
            }
            if (param3 !== 0) {
                paramArray.push(param3);
            }
            if (param4 !== 0) {
                paramArray.push(param4);
            }
            console.log(paramArray)
            const proposeData = {
                proposal_id: proposal.proposal_id,
                proposer_id: proposal.worker_id,
                values: valueArray,
                methods: method,
                contract: contract,
                description: description,
                params: paramArray,
            }
            console.log("클라이언트쪽 요청 메시지", proposeData)
            setOpen(false)
            setLoading(true);
            const res = await axios.post("http://localhost:4000/votes/propose", proposeData);
            setLoading(false);
            window.alert("새로운 투표가 시작되었습니다.")
            navigate("/ReRendering");
        } catch (err) {
            window.alert("새로운 투표 생성이 실패하였습니다.")
            setLoading(false);
        }
    }

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>
                Propose
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Propose to Governor</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <div>
                            Governor Contract 의 <b>propose 함수의 params 조건에 맞게</b> 입력해주세요.
                        </div>
                        <div>
                            <b>유지/보수를 하는 Admin 전용 메뉴입니다.</b>
                        </div>
                    </DialogContentText>
                    <Box sx={{ width: '100%' }}>
                        <Grid container rowSpacing={3} justifyContent="center" alignItems="center" columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Contract name" id="contract" placeholder='실행할 컨트랙트 이름' onChange={handleContract} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Ether amount" id="values" placeholder='함께 전송할 ether의 양' defaultValue={0} onChange={handleValues} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Methods" id="method" placeholder='실행할 methods name' onChange={handleMethods} />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField fullWidth label="param1(string)" id="param1" onChange={handleParam1} />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField fullWidth label="param2(string)" id="param2" onChange={handleParam2} />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField fullWidth label="param3(int)" id="param3" onChange={handleParam3} />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField fullWidth label="param4(int)" id="param4" onChange={handleParam4} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Description" id="description" placeholder='제안에 대한 설명' onChange={handleDescription} />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Propose</Button>
                </DialogActions>
            </Dialog>
            <Backdrop
                sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <div>
                    <h2>Governor 컨트랙트의 Propose 함수를 실행하여 새로운 투표가 시작될 것입니다.</h2>
                    <h2>블록체인 네트워크의 환경에 따라 2~10분이 소요됩니다. 잠시만 기다려 주세요.</h2>
                </div>
                <div>
                    <CircularProgress color="inherit" />
                </div>

            </Backdrop>
        </div>
    );
}