import * as React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "../components/Typography";

const item = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  px: 5,
};

function ProductValues() {
  return (
    <Box
      component="section"
      sx={{ display: "flex", overflow: "hidden", bgcolor: "secondary.light" }}
    >
      <Container
        sx={{
          mt: 15,
          mb: 30,

          position: "relative",
        }}
      >
        <div
          style={{
            justifyContent: "center",
            display: "flex",
            marginBottom: "100px",
            fontSize: "80px",
          }}
        >
          Worker's Review
        </div>
        <Box
          component="img"
          src="/static/themes/onepirate/productCurvyLines.png"
          alt="curvy lines"
          sx={{ pointerEvents: "none", position: "absolute", top: -180 }}
        />
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box
                component="img"
                src={require("../img/worker3.jpg")}
                alt="suitcase"
                sx={{ height: 100, borderRadius: 50 }}
              />
              <Typography variant="h6" sx={{ my: 5 }}>
                - Harold -
              </Typography>
              <Typography variant="h5">
                {
                  "My motto is very simple. It doesn't cost you a penny to be nice and kind,"
                }

                {
                  "but it will cost you everything if you're not. If I'm free and somebody needs my help, I'll be the first one to jump in, in a heartbeat."
                }
                <br />
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box
                component="img"
                src={require("../img/worker1.jpg")}
                alt="graph"
                sx={{ height: 100, borderRadius: 50 }}
              />
              <Typography variant="h6" sx={{ my: 5 }}>
                - Christine -
              </Typography>
              <Typography variant="h5">
                {
                  "Privatize a pool, take a Japanese bath or wake up in 900m2 of garden… "
                }

                {"your Sundays will not be alike."}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box
                component="img"
                src={require("../img/worker2.jpg")}
                alt="clock"
                sx={{ height: 100, borderRadius: 50 }}
              />
              <Typography variant="h6" sx={{ my: 5 }}>
                - Dave -
              </Typography>
              <Typography variant="h5">
                {"By registering, you will access specially negotiated rates "}
                {"that you will not find anywhere else."}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box
                component="img"
                src={require("../img/worker4.jpg")}
                alt="clock"
                sx={{ height: 100, borderRadius: 50 }}
              />
              <Typography variant="h6" sx={{ my: 5 }}>
                - Jone -
              </Typography>
              <Typography variant="h5">
                {"By registering, you will access specially negotiated rates "}
                {"that you will not find anywhere else."}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box
                component="img"
                src={require("../img/worker5.jpg")}
                alt="clock"
                sx={{ height: 100, borderRadius: 50 }}
              />
              <Typography variant="h6" sx={{ my: 5 }}>
                - Mary -
              </Typography>
              <Typography variant="h5">
                {"By registering, you will access specially negotiated rates "}
                {"that you will not find anywhere else."}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box sx={item}>
              <Box
                component="img"
                src={require("../img/worker6.jpg")}
                alt="clock"
                sx={{ height: 100, borderRadius: 50 }}
              />
              <Typography variant="h6" sx={{ my: 5 }}>
                - Timothy -
              </Typography>
              <Typography variant="h5">
                {"By registering, you will access specially negotiated rates "}
                {"that you will not find anywhere else."}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}

export default ProductValues;
