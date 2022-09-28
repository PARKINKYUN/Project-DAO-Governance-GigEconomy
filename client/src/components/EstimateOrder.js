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
import Typography from '@mui/material/Typography';

const StyledRating = styled(Rating)({
    '& .MuiRating-iconFilled': {
        color: '#ff6d75',
    },
    '& .MuiRating-iconHover': {
        color: '#ff3d47',
    },
});

export default function EstimateOrder({ token, worker_id, order_id, client_id }) {
    const [open, setOpen] = useState(false);
    const [score, setScore] = useState(5);

    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleScore = (e) => {
        console.log(e.target.value, "점을 선택하였습니다.")
        setScore(e.target.value);
    };

    const evaluateOrder = async () => {
        try {
            const newEstimate = {
                worker_id: worker_id,
                order_id: order_id,
                client_id: client_id,
                score: score,
            }

            const res = await axios.post("http://localhost:4000/estimate/newEstimation", newEstimate, { headers: { authorization: token } });

            if (res.status === 200) {
                window.alert("작업에 대한 평가가 정상적으로 저장되었습니다. 더 이상 작업 목록에 노출되지 않습니다.")
                setScore(5);
                setOpen(false);
                navigate("/clientInfo");
            }
        } catch (err) {
            window.alert("오류가 발생했습니다. 다시 시도해주세요");
            setScore(0);
            setOpen(false);
        }
    }

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>
                Evaluation
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Evaluate the results of the work</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        친한 사람이 같은 작업을 의뢰한다고 했을 때,<br/>이번에 함께 작업했던 <b>Worker를 추천할 의향</b>은 10점 만점 중 몇 점입니까?
                    </DialogContentText>
                    <Box
                        sx={{
                            '& > legend': { mt: 2 },
                        }}
                    >
                        <Typography component="legend">{`${score}`}점 / 10점</Typography>
                        <Rating name="customized-10" defaultValue={5} max={10} onClick={handleScore} />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={evaluateOrder}>Post</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}