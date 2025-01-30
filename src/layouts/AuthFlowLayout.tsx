import { Box } from "@mui/material";
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AuthHeader from "../components/Header/AuthHeader";
import AuthFooter from "../components/Footer/AuthFooter";
import { useAuth } from "../store/AuthContext";
import { routes } from "../utils/links";
import { EnOnboardingStatus } from "../utils/enums";

const AuthFlowLayout = () => {
  const { user, loading, userDetails } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate(routes.auth.signIn); // Redirect to login if not authenticated
      }
       else if (userDetails?.onboardingStatus === EnOnboardingStatus.STATUS_0) {
        navigate(routes.auth.stepForm); // Redirect to step 6 if status is 1
      }
       else if (userDetails?.onboardingStatus === EnOnboardingStatus.STATUS_2) {
        navigate(routes.dashboard.home); // Redirect to dashboard if onboarding is completed
      }
    }
  }, [user, loading, userDetails?.onboardingStatus, navigate]);

  return (
    <Box sx={{ bgcolor: "grey.200", height: "100vh" }}>
      <AuthHeader />
      <Outlet />
      <AuthFooter />
    </Box>
  );
};

export default AuthFlowLayout;
