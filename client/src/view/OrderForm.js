import * as React from "react";
import PropTypes from "prop-types";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Paper from "../components/Paper";

function OrderForm(props) {
  const { children } = props;

  return (
    <Box
      sx={{
        display: "flex",
        backgroundImage: "url(/static/onepirate/appCurvyLines.png)",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mt: 1, mb: 12 }}>
          <Paper
            background="light"
            sx={{ py: { xs: 4, md: 8 }, px: { xs: 3, md: 6 } }}
          >
            {children}
          </Paper>
        </Box>
      </Container>
    </Box>
  );
}

OrderForm.propTypes = {
  children: PropTypes.node,
};

export default OrderForm;
