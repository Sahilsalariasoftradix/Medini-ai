import { Box, Typography } from "@mui/material";

const NotFound = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "grey.200",
      }}
    >
      <Typography variant="h1">404</Typography>
    </Box>
  );
};

export default NotFound;
