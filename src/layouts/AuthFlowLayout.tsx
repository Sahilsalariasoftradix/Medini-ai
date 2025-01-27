import { Box } from "@mui/material";
import React from "react";
import { Outlet } from "react-router-dom";
import AuthHeader from "../components/Header/AuthHeader";
import AuthFooter from "../components/Footer/AuthFooter";

const AuthFlowLayout = () => {
  return (
    <Box sx={{ bgcolor: "grey.200", height: "100vh" }}>
      <AuthHeader />
      <Outlet />
      <AuthFooter />
    </Box>
  );
};

export default AuthFlowLayout;
