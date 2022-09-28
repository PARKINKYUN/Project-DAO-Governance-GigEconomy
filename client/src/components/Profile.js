import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Stack from "@mui/material/Stack";

export default function Profile({ image }) {
  return (
    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" >
      <Avatar
        sx={{ width: 112, height: 112 }}
        alt="Remy Sharp"
        src={"http://localhost:4000/images/" + image}
      />
    </Stack>
  );
}
