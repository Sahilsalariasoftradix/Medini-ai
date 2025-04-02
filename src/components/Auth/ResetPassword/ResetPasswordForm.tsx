import { Box, Typography } from "@mui/material";
import CommonTextField from "../../common/CommonTextField";
import { staticText } from "../../../utils/staticText";
import CommonButton from "../../common/CommonButton";
import CommonLink from "../../common/CommonLink";
import { routes } from "../../../utils/links";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
  useAuthHook,
} from "../../../hooks/useAuth";
import { SubmitHandler, useForm } from "react-hook-form";
import { resetPasswordWithEmail } from "../../../firebase/AuthService";
import CommonSnackbar from "../../common/CommonSnackbar";
import {
  resetPasswordEmailAlreadyRegisteredMessage,
  resetPasswordEmailSentMessage,
} from "../../../utils/errorHandler";

const ResetPasswordForm = () => {
  // Validate hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
  });
  const {
    setSnackbarOpen,
    setSnackbarMessage,
    setSnackbarSeverity,
    snackbarOpen,
    handleSnackbarClose,
    snackbarMessage,
    snackbarSeverity,
    navigate,
    setIsLoading,
    isLoading,
  } = useAuthHook();
  // Form submission handler
  const onSubmit: SubmitHandler<ResetPasswordSchemaType> = async (data) => {
    setIsLoading(true);
    try {
      //* Calling resetPassword with email and password from form data
      const successMessage = await resetPasswordWithEmail(data.email);
      setSnackbarSeverity("success");
      setSnackbarMessage(successMessage || resetPasswordEmailSentMessage);
      setSnackbarOpen(true);
      reset();
      setIsLoading(false);
      setTimeout(function () {
        navigate(routes.auth.signIn, { replace: true });
      }, 2000);
    } catch (error: any) {
      setSnackbarSeverity("error");
      setSnackbarMessage(resetPasswordEmailAlreadyRegisteredMessage);
      setIsLoading(false);
      setSnackbarOpen(true);
      throw error
    }
  };
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={"calc(100vh - 134px)"}
    >
      <Box sx={{ p: "40px", m: "auto" }} className="auth-form">
        <Typography variant="h3" align="center" mb={2}>
          {staticText.auth.resetPasswordHeading}
        </Typography>
        <Typography
          variant="bodyLargeMedium"
          mb={4}
          color="grey.600"
          align="center"
        >
          {" "}
          {staticText.auth.resetPasswordDescription}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CommonTextField
            placeholder="Enter Email"
            type="email"
            register={register("email")}
            errorMessage={errors.email?.message}
          />
          <CommonButton
            loading={isLoading}
            text={staticText.auth.resetPasswordButton}
            sx={{ mt: 5 }}
            type="submit"
            fullWidth
          />
          <Box sx={{ textAlign: "center" }} mt={3}>
            <CommonLink
              to={routes.auth.signIn}
              sx={{ color: "secondary.main" }}
              variant="bodyLargeExtraBold"
            >
            Back to Login
            </CommonLink>
          </Box>
        </form>
        {/* Snackbar */}
        <CommonSnackbar
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          severity={snackbarSeverity}
        />
      </Box>
    </Box>
  );
};

export default ResetPasswordForm;
