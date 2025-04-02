import { useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { z } from "zod";
import { formErrorMessage } from "../utils/errorHandler";
// Validation schema
export const SignUpSchema = z.object({
  email: z
    .string()
    .min(1, { message: formErrorMessage.email.required })
    .max(100, "Max 100 characters.") // Checks if the field is empty
    .email({ message: formErrorMessage.email.invalid }), // Checks for a valid email format
  password: z
    .string()
    .min(1, { message: formErrorMessage.password.required }) // Empty password
    .min(8, { message: formErrorMessage.password.tooShort }) // Less than 8 characters
    .max(20, "Max 20 characters.")
    .refine(
      (password) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          password
        ),
      {
        message:
          "Password must contain 8 characters (at least 1 uppercase, 1 lowercase, 1 number, and 1 special character).",
      }
    ),
  firstName: z
    .string()
    .min(1, formErrorMessage.firstName.required)
    .max(50, formErrorMessage.firstName.tooLong),
  lastName: z
    .string()
    .min(1, formErrorMessage.lastName.required)
    .max(50, formErrorMessage.lastName.tooLong),

});
// Validation schema
export const SignInSchema = z.object({
  email: z
    .string()
    .min(1, { message: formErrorMessage.email.required })
    .max(100, "Max 100 characters.") // Checks if the field is empty
    .email({ message: formErrorMessage.email.invalid }), // Checks for a valid email format
  password: z
    .string()
    .min(1, { message: formErrorMessage.password.required }) // Empty password
    // .min(8, { message: formErrorMessage.password.tooShort })
    // .max(20, "Max 20 characters.") // Less than 8 characters
    // .refine(
    //   (password) =>
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
    //       password
    //     ),
    //   {
    //     message:
    //       "Password must contain 8 characters (at least 1 uppercase, 1 lowercase, 1 number, and 1 special character).",
    //   }
    // ),
});
// Validation schema
export const ResetPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: formErrorMessage.email.required })
    .max(100, "Max 100 characters.") // Checks if the field is empty
    .email({ message: formErrorMessage.email.invalid }), // Checks for a valid email format
});
// Type declaration for schema
export type ResetPasswordSchemaType = z.infer<typeof ResetPasswordSchema>;
// Type declaration for schema
export type SignInSchemaType = z.infer<typeof SignInSchema>;
// Type declaration for schema
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;

export const useAuthHook = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    isLoading,
  };
};
