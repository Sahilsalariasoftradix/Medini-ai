import { Navigate, Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import AuthHeader from "../components/Header/AuthHeader";
import AuthFooter from "../components/Footer/AuthFooter";
import { useAuth } from "../store/AuthContext";
import { routes } from "../utils/links";
import { EnOnboardingStatus } from "../utils/enums";
import PageLoader from "../components/Loading/PageLoader";

const AuthFlowLayout = () => {
  const { user, loading, userDetails } = useAuth();


  // ✅ Show loading state while userDetails are still loading
  if (loading || userDetails == undefined) {
    return <PageLoader />;
  }
  // ✅ Redirect logic
  if (!user) {
    return <Navigate to={routes.auth.signIn} replace />;
  }
 
  if (userDetails?.onboardingStatus === EnOnboardingStatus.STATUS_2) {
    return <Navigate to={routes.sidebar.bookings.link} replace />;
  }

  return (
    <Box sx={{ bgcolor: "grey.200", height: "100vh" }}>
      <AuthHeader />
      <Outlet />
      <AuthFooter />
    </Box>
  );
};

export default AuthFlowLayout;
