import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { z } from "zod";
// Validation schema
export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name is too long"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name is too long"),
});
// Validation schema
export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});
// Validation schema
export const ResetPasswordSchema = z.object({
  email: z.string().email(),
});
// Type declaration for schema
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
// Type declaration for schema
export type SignInSchemaType = z.infer<typeof SignInSchema>;
// Type declaration for schema
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export const useAuthHook = () => {
  const [showPassword, setShowPassword] = useState<Boolean>(false);
  const [isLoading,setIsLoading] = useState<boolean>(false);
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  // Navigate
  const navigate = useNavigate();
  // Static text
  const context = useOutletContext<any>();
  const text = Array.isArray(context) ? context[0] : undefined;
  
  // Remember me checkbox
  const [checked, setChecked] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  // Mouse events
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleMouseUpPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  return {
    showPassword,
    setShowPassword,
    handleClickShowPassword,
    handleMouseDownPassword,
    handleMouseUpPassword,
    checked,
    setChecked,
    handleChangeCheckbox,
    snackbarOpen,
    setSnackbarOpen,
    snackbarMessage,
    setSnackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
    setSnackbarSeverity,
    text,
    navigate,
    setIsLoading,
    isLoading
  };
};
