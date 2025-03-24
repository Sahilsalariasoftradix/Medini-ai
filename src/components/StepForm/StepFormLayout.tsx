import React from "react";
import { Box, BoxProps } from "@mui/material";
import { getMaxHeight } from "../../utils/common";

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
      <Box
        sx={{
          px: { xs: "20px", md: "40px" },
          py: "20px",
          m: { xs: 1, md: "auto" },
          ...getMaxHeight(),
          overflow: "auto",
          minWidth: {
            xs: "100%",
            md: "470px",
          },
        }}
        className={`auth-form ${className}`}
      >
        {children}
      </Box>
    </Box>
  );
};

export default StepFormLayout;
