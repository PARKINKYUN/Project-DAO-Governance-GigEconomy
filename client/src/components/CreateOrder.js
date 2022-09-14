import * as React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import { Field, Form, FormSpy } from "react-final-form";
import Typography from "../components/Typography";

import Header from "../view/Header";
import AppForm from "../view/AppForm";
import RFTextField from "../form/RFTextField";
import FormButton from "../form/FormButton";
import FormFeedback from "../form/FormFeedback";
import withRoot from "../withRoot";
import axios from "axios";
import { useLocation } from "react-router-dom";

function CreateOrder(userInfo) {
  const [sent, setSent] = useState(false);
  const location = useLocation();

  const handleSubmit = async (values) => {
    setSent(true);
    const { title, deadline, compensation, content } = values;
    try {
      if (location.state.workerId === null) {
        const res = await axios.post("http://localhost:4000/orders/new_order", {
          title: title,
          client_id: userInfo.client_id,
          deadline: deadline,
          compensation: compensation,
          content: content,
        });
        if (res.status === 200) {
          window.alert("새로운 오더를 성공적으로 작성했습니다.");
        } else {
          console.log("오더작성 실패");
        }
      }
      if (location.state.workerId !== null) {
        const res = await axios.post(
          `http://localhost:4000/orders/direct_order/${""}`,
          {
            title: title,
            client_id: userInfo.client_id,
            worker_id: location.state.workerId,
            deadline: deadline,
            compensation: compensation,
            content: content,
          }
        );
        if (res.status === 200) {
          window.alert("새로운 오더를 성공적으로 작성했습니다.");
        } else {
          console.log("오더작성 실패");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <React.Fragment>
      <Header />
      <AppForm>
        <React.Fragment>
          <Typography variant="h3" gutterBottom marked="center" align="center">
            New Order
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
                label="Deadline"
                margin="normal"
                name="deadline"
                required
                size="large"
              />
              <Field
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Compensation"
                margin="normal"
                name="compensation"
                required
                size="large"
              />
              <Field
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
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
      </AppForm>
    </React.Fragment>
  );
}

export default withRoot(CreateOrder);
