import { Button, ButtonProps, CircularProgress } from "@mui/material";
import React from "react";

interface CommonButtonProps extends ButtonProps {
  text: string; // Custom prop for button text
  loading?: boolean; // Optional loading state
}

const CommonButton: React.FC<CommonButtonProps> = ({
  text,
  variant = "contained",
  type = "button",
  sx = {},
  fullWidth = false,
  loading,
  ...rest
}) => {

  return (
    <Button
      variant={variant}
      disabled={loading}
      type={type}
      sx={{ p: 1.5, ...sx }}
      fullWidth={fullWidth}
      {...rest}
    >

      {/* If loading, show spinner */}
      {loading ? (
        <CircularProgress
          size={24}
          sx={{
            color: "additional.white",
          }}
        />
      ) : (
        <>{text}</>
      )}
    </Button>
  );
};

export default CommonButton;
