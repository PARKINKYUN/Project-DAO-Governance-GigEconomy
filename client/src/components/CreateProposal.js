import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import { Field, Form, FormSpy } from "react-final-form";
import Typography from "../components/Typography";
import OrderForm from "../view/OrderForm";
import RFTextField from "../form/RFTextField";
import FormButton from "../form/FormButton";
import FormFeedback from "../form/FormFeedback";
import withRoot from "../withRoot";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

function CreateProposal() {
  const [sent, setSent] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { userInfo, token } = location.state;

  const handleSubmit = async (values) => {
    setSent(true);
    const { title, content } = values;

    console.log(title, content, "-=========", userInfo, token)

    try {
      const res = await axios.post("http://localhost:4000/proposals/newproposal",
        {
          title: title,
          content: content,
        },
        { headers: { authorization: token } }
      );
      if (res.status === 200) {
        window.alert("새로운 제안을 성공적으로 작성했습니다.");
      } else {
        window.alert("새로운 제안 작성에 실패했습니다. 다시 시도해주세요.")
        console.log("제안 작성 실패");
      }
      navigate(-1);
    } catch (err) {
      console.error(err);
      window.alert("오류가 발생하여 메인페이지로 이동합니다.")
      navigate("/");
    }
  };

  return (
    <React.Fragment>
      <OrderForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            Create Proposal
          </Typography>
        </React.Fragment>
        <Form onSubmit={handleSubmit} subscription={{ submitting: true }}>
          {({ handleSubmit: handleSubmit2, submitting }) => (
            <Box
              component="form"
              onSubmit={handleSubmit2}
              noValidate
              sx={{ mt: 1 }}
            >
              <Field
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Title"
                margin="normal"
                name="title"
                required
                size="large"
              />

              <Field
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                multiline
                label="Content"
                margin="normal"
                name="content"
                required
                size="large"
              />
              <FormSpy subscription={{ submitError: true }}>
                {({ submitError }) =>
                  submitError ? (
                    <FormFeedback error sx={{ mt: 2 }}>
                      {submitError}
                    </FormFeedback>
                  ) : null
                }
              </FormSpy>
              <FormButton
                sx={{ mt: 3, mb: 2 }}
                disabled={submitting || sent}
                color="secondary"
                fullWidth
              >
                {submitting || sent ? "In progress…" : "Complete"}
              </FormButton>
            </Box>
          )}
        </Form>
      </OrderForm>
    </React.Fragment>
  );
}

export default withRoot(CreateProposal);
