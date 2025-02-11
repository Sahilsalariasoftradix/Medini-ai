import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  IconButton,
} from "@mui/material";
import closeIcon from "../../assets/icons/close-modal.svg"; // Replace with your actual icon path
import CommonButton from "./CommonButton";

interface CommonDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  fullWidth?: boolean;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl";
  hideCloseIcon?: boolean;
}
const DialogStyles = {
  border: "2px solid #E2E8F0",
  boxShadow: "0px 5px 10px 0px #0000001A",
  borderRadius: "16px",
};
const CommonDialog: React.FC<CommonDialogProps> = ({
  open,
  onClose,
  title,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  fullWidth = true,
  maxWidth = "xs",
  hideCloseIcon = false,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      sx={{
        " & .MuiPaper-root ": DialogStyles,
      }}
    >
      <Box display="flex" alignItems="center" justifyContent="space-between">
        {title && (
          <DialogTitle component={"h6"} sx={{ p: 0 }}>
            {title}
          </DialogTitle>
        )}
        {!hideCloseIcon && (
          <IconButton onClick={onClose}>
            <img src={closeIcon} alt="Close" width={24} height={24} />
          </IconButton>
        )}
      </Box>

      <DialogContent sx={{ p: 0 }}>{children}</DialogContent>

      <DialogActions sx={{ mt: 2 }}>
        <CommonButton
          sx={{ width: "50%" }}
          text={cancelText}
          variant="containedSecondary"
          onClick={onClose}
        />
        {onConfirm && (
          <CommonButton
            sx={{ width: "50%" }}
            text={confirmText}
            onClick={onConfirm}
          />
        )}
      </DialogActions>
    </Dialog>
  );
};

export default CommonDialog;
