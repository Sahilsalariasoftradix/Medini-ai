import { Box } from "@mui/material";
import mainLogo from "../../assets/logos/medini-ai-logo.svg";
import { useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../utils/links";
import CommonButton from "../common/CommonButton";
import { useAuth } from "../../store/AuthContext";
const AuthHeader = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth(); // Get user and logout function
  const path = location.pathname;

  const handleLogout = async () => {
    try {
      await logout();
      navigate(routes.auth.signIn); // Redirect to sign-in after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

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

        {user && !(path === routes.auth.signIn || path === routes.auth.signUp) ? (
          <CommonButton
            variant="contained"
            color="secondary"
            sx={{ height: "56px", width: "150px" }}
            text={"Logout"}
            type="button"
            onClick={handleLogout} // Logout action
          />
        ) : (
          !(path === routes.auth.signIn || path === routes.auth.signUp) && (
            <CommonButton
              variant="contained"
              color="primary"
              sx={{ height: "56px", width: "150px" }}
              text={"Sign up"}
              type="submit"
            />
          )
        )}
      </Box>
    </Box>
  );
};

export default AuthHeader;
