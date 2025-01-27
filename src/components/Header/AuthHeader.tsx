import { Box, Button } from "@mui/material";
import mainLogo from "../../assets/logos/medini-ai-logo.svg";
import { useLocation } from "react-router-dom";
import { routes } from "../../utils/links";
import { useAuthHook } from "../../hooks/useAuth";
import CommonButton from "../common/CommonButton";
const AuthHeader = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <Box>
      <Box
        sx={{ px: 6, py: 3, display: "flex", justifyContent: "space-between" }}
      >
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
        {!(path === routes.auth.signIn || path === routes.auth.signUp) && (
          <CommonButton
            variant="contained"
            color="primary"
            sx={{ height: "56px", width: "150px" }}
            text={"Sign up"}
            type="submit"
          />
        )}
      </Box>
    </Box>
  );
};

export default AuthHeader;
