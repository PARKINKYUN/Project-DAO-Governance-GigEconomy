import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function FormDialog({ token, worker_id, order_id, order_title }) {
    const [open, setOpen] = useState(false);
    const [content, setContent] = useState("");

    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleContent = (e) => {
        setContent(e.target.value);
    };

    const postReview = async () => {
        try {
            const newReview = {
                worker_id: worker_id,
                order_id: order_id,
                order_title: order_title,
                content: content,
            }
            const res = await axios.post("http://localhost:4000/reviews/review", newReview, { headers: { authorization: token } });

            if(res.status === 200) {
                const changeOrderReview = await axios.patch("http://localhost:4000/orders/isReviewed", {order_id: order_id}, { headers: { authorization: token } });
                window.alert("작업 후기가 정상적으로 저장되었습니다. 더 이상 작업 목록에 노출되지 않습니다.")
                setContent("");
                setOpen(false);
                navigate("/workerInfo");
            }
        } catch (err) {
            window.alert("오류가 발생했습니다. 다시 시도해주세요");
            setContent("");
            setOpen(false);
        }
    }

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen}>
                Review
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Write down how you work</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        이번 작업을 하면서 새롭게 깨달은 점이나 후회되는 부분이 있다면 간략하게 적어보세요. 당신에게 관심있는 고용주들은 이것을 매우 흥미롭게 생각할 것입니다.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="post"
                        label="Post"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={handleContent}
                        name="content"
                        value={content}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={postReview}>Post</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}