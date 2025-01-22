import { Box, Button } from "@mui/material";
import mainLogo from "../../assets/logos/medini-ai-logo.svg";
const AuthHeader = () => {
  return (
    <Box>
      <Box sx={{ px: 6,py:3 ,display: "flex", justifyContent: "space-between" }}>
        <Box
          component="img"
          sx={{
            height: 39,
            width: 221,
            //   maxHeight: { xs: 39, md: 39 },
            //   maxWidth: { xs: 350, md: 250 },
          }}
          alt="logo"
          src={mainLogo}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ height: "56px", width: "150px" }}
        >
          Sign up
        </Button>
      </Box>
    </Box>
  );
};

export default AuthHeader;
