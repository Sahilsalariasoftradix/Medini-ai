import React from "react";
import { Snackbar, Alert, AlertProps, SnackbarProps } from "@mui/material";

// Define prop types for the component
interface CommonSnackbarProps extends SnackbarProps {
  message: string; // The message to display
  onClose: () => void;
  severity?: AlertProps["severity"]; // Severity levels: 'error', 'warning', 'info', 'success'
}

const CommonSnackbar: React.FC<CommonSnackbarProps> = ({
  open,
  onClose,
  message,
  severity = "info", // Default to 'info'
  autoHideDuration = 4000, // Default duration
  anchorOrigin = { vertical: "top", horizontal: "right" }, // Default position
  ...props
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      {...props}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        // sx={{ width: "100%" }} // Ensure the alert fills the snackbar width
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CommonSnackbar;
