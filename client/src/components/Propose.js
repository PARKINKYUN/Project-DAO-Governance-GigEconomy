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
    const [targets, setTargets] = useState([]);
    const [values, setValues] = useState([]);
    const [method, setMethod] = useState([]);
    const [param1, setParam1] = useState();
    const [param2, setParam2] = useState();
    const [param3, setParam3] = useState();
    const [param4, setParam4] = useState();
    const [description, setDescription] = useState("");

    const handleContract = (e) => {
        setContract(e.target.value);
    }

    const handleTargets = (e) => {
        setTargets(e.target.value);
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
        setParam3(e.target.value);
    }

    const handleParam4 = (e) => {
        setParam4(e.target.value);
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

    const handleSubmit = () => {
        let targetArray = [...targets];
        let valueArray = [...values];
        let paramArray = [...param1, ...param2, ...param3, ...param4];
        const proposeData = {
            propsal_index: proposal.proposal_id,
            proposer_id: proposal.worker_id,
            targets: targetArray,
            values: valueArray,
            methods: method,
            contract: contract,
            description: description,
            params: paramArray,
        }

        console.log("test", proposeData)
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
                                <TextField fullWidth label="Contract address" id="targets" placeholder='실행할 컨트랙트 주소' onChange={handleTargets} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Ether amount" id="values" placeholder='함께 전송할 ether의 양' defaultValue={0} onChange={handleValues} />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField fullWidth label="Methods" id="method" placeholder='실행할 methods name' onChange={handleMethods} />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField fullWidth label="param1" id="param1" onChange={handleParam1} />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField fullWidth label="param2" id="param2" onChange={handleParam2} />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField fullWidth label="param3" id="param3" onChange={handleParam3} />
                            </Grid>
                            <Grid item xs={3}>
                                <TextField fullWidth label="param4" id="param4" onChange={handleParam4} />
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
        </div>
    );
}