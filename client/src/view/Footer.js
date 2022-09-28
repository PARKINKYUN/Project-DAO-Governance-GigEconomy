import * as React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";

import Container from "@mui/material/Container";
import Typography from "../components/Typography";

const iconStyle = {
  width: 48,
  height: 48,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "warning.main",
  mr: 1,
  "&:hover": {
    bgcolor: "warning.dark",
  },
};

export default function Footer() {
  return (
    <Typography
      component="footer"
      sx={{ display: "flex" }}
      style={{ backgroundColor: "#FFF5F8" }}
    >
      <Container sx={{ my: 4, display: "flex" }}>
        <div
          style={{
            color: "black",
            fontSize: "20px",
            fontWeight: "500",
            margin: "0 20px 0 0",
            padding: "10px 0 0 0",
          }}
        >
          Team
        </div>
        <Grid container spacing={5}>
          <Grid item xs={6} sm={4} md={3}>
            <Grid
              container
              direction="column"
              justifyContent="flex-end"
              spacing={2}
              sx={{ height: 120 }}
            >
              <Grid item sx={{ display: "flex" }}>
                <Box
                  style={{ borderRadius: "50%" }}
                  component="a"
                  href="https://github.com/PARKINKYUN"
                  target={"_blank"}
                  sx={iconStyle}
                >
                  <img
                    src={require("../img/ik.png")}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                </Box>
                <Box
                  style={{ borderRadius: "50%" }}
                  component="a"
                  href="https://github.com/kimsj3592"
                  target={"_blank"}
                  sx={iconStyle}
                >
                  <img
                    src={require("../img/git sj.png")}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                </Box>
                <Box
                  style={{ borderRadius: "50%" }}
                  component="a"
                  href="https://github.com/rootrue"
                  target={"_blank"}
                  sx={iconStyle}
                >
                  <img
                    src={require("../img/hj.jpeg")}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                </Box>

                <Box
                  style={{ borderRadius: "50%" }}
                  component="a"
                  href="https://github.com/JSND-OJ00"
                  target={"_blank"}
                  sx={iconStyle}
                >
                  <img
                    src={require("../img/jh.jpeg")}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                    }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Grid>

          <Grid
            item
            xs={6}
            sm={8}
            md={4}
            style={{ margin: "0 100px 0 100px" }}
          ></Grid>
        </Grid>
      </Container>
      <div
        style={{
          color: "black",
          display: "flex",
          alignItems: "center",
          marginRight: "100px",
          fontSize: "20px",
          fontWeight: "500",
        }}
      >
        Copyright © 2022 Gigs
      </div>
    </Typography>
  );
}
