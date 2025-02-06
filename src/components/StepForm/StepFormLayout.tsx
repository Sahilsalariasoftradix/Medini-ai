import React from "react";
import { Box, BoxProps } from "@mui/material";

interface StepFormLayoutProps extends BoxProps {
  children: React.ReactNode;
  className?: string;
}

const StepFormLayout: React.FC<StepFormLayoutProps> = ({
  children,
  className = "",
  ...boxProps
}) => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="calc(100vh - 134px)"
      {...boxProps}
    >
      <Box sx={{ p: { xs: "20px", md: "40px" }, m: { xs: 1, md: "auto" },maxHeight: { xs: "700px", md: "100%" },overflow: "auto" }} className={`auth-form ${className}`}>
        {children}
      </Box>
    </Box>
  );
};

export default StepFormLayout;
