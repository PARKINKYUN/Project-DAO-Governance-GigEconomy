import * as React from "react";
import Box from "@mui/material/Box";
// import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import { Field, Form, FormSpy } from "react-final-form";
import Typography from "../components/Typography";

import Header from "../view/Header";
import AppForm from "../view/AppForm";
import { email, required } from "../form/validation";
import RFTextField from "../form/RFTextField";
import FormButton from "../form/FormButton";
import FormFeedback from "../form/FormFeedback";
import withRoot from "../withRoot";
import { Link as RouterLink } from "react-router-dom";
import { useState, useRef } from "react";
import axios from "axios";

function SignUp({ history }) {
  const [sent, setSent] = useState(false);
  const isWorker = useRef(false);

  const handleIsWorker = () => {
    console.log("변경전", isWorker)
    if (isWorker.current) {
      isWorker.current = false;
    } else {
      isWorker.current = true;
    }
    console.log("변경후", isWorker)
  }

  const validate = (values) => {
    const errors = required(
      ["email", "nickname", "password"],
      values
    );

    if (!errors.email) {
      const emailError = email(values.email);
      if (emailError) {
        errors.email = emailError;
      }
    }

    return errors;
  };

  const handleSubmit = async (values) => {
    setSent(true);
    const { email, nickname, password } = values;

    // 사용자가 client인지 worker인지에 따라서 분기
    try {
      if (isWorker.current) {
        const res = await axios.post('http://localhost:4000/workers/join', {
            worker_id: email,
            nickname: nickname,
            password: password
          })
        if (res.status === 200) {
          window.alert("회원가입에 성공했습니다. 로그인 해주세요.")
          history.push('/signin');

        } else {
          console.log("회원가입 실패")
        }
      } else {
        const res = await axios.post('http://localhost:4000/clients/join', {
          client_id: email,
          nickname: nickname,
          password: password
        })
        if (res.status === 200) {
          window.alert("회원가입에 성공했습니다. 로그인 해주세요.")
          history.push('/signin');

        } else {
          console.log("회원가입 실패")
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
            Sign Up
          </Typography>
          <Typography variant="body2" align="center">
            <Link component={RouterLink} to="/signin" underline="always">
              Already have an account?
            </Link>
          </Typography>
        </React.Fragment>
        <Form
          onSubmit={handleSubmit}
          subscription={{ submitting: true }}
          validate={validate}
        >
          {({ handleSubmit: handleSubmit2, submitting }) => (
            <Box
              component="form"
              onSubmit={handleSubmit2}
              noValidate
              sx={{ mt: 6 }}
            >
              <Field
                autoComplete="email"
                autoFocus
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="ID (email)"
                margin="normal"
                name="email"
                required
                size="large"
              />
              <Field
                autoComplete="text"
                component={RFTextField}
                disabled={submitting || sent}
                fullWidth
                label="Nickname"
                margin="normal"
                name="nickname"
                required
              />
              <Field
                fullWidth
                size="large"
                component={RFTextField}
                disabled={submitting || sent}
                required
                name="password"
                autoComplete="current-password"
                label="Password"
                type="password"
                margin="normal"
              />
              <input type="checkbox" name="worker" onChange={handleIsWorker} /> Gig Worker로 등록하려면 체크!
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
                {submitting || sent ? "In progress…" : "Sign Up"}
              </FormButton>
            </Box>
          )}
        </Form>
      </AppForm>
    </React.Fragment>
  );
}

export default withRoot(SignUp);
