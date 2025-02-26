// MUI imports
import {
  Box,
  Button,
  Divider,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";
// Local imports
import "../../../styles/_auth-form.scss";
import googleIcon from "../../../assets/icons/google-icon.svg";
import appleIcon from "../../../assets/icons/apple-icon.svg";
import hidden from "../../../assets/icons/eye-off.svg";
import visibile from "../../../assets/icons/eye-on.svg";
// Validation packages
import { zodResolver } from "@hookform/resolvers/zod"; // Import zodResolver
import { SubmitHandler, useForm } from "react-hook-form";
import {
  signInWithApple,
  signInWithGoogle,
  signUpWithEmail,
} from "../../../firebase/AuthService";

import {
  SignUpSchema,
  SignUpSchemaType,
  useAuthHook,
} from "../../../hooks/useAuth";
import CommonButton from "../../common/CommonButton";
import CommonTextField from "../../common/CommonTextField";
import CommonLink from "../../common/CommonLink";
import { externalLinks, routes } from "../../../utils/links";
import CommonSnackbar from "../../common/CommonSnackbar";
import {
  successfullyRegisteredMessage,
  unexpectedErrorMessage,
} from "../../../utils/errorHandler";
import Grid from "@mui/material/Grid2";
import { getMaxHeight } from "../../../utils/common";
// Static Icons
const GoogleIcon = <img alt="edit" src={googleIcon} />;
const AppleIcon = <img alt="edit" src={appleIcon} />;
const VisibilityOff = <img alt="edit" src={hidden} />;
const Visibility = <img alt="edit" src={visibile} />;
const SignUpForm = () => {
  // Validate hook
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema) });
  const {
    showPassword,
    handleClickShowPassword,
    handleMouseDownPassword,
    handleMouseUpPassword,
    setSnackbarOpen,
    snackbarMessage,
    setSnackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
    setSnackbarSeverity,
    snackbarOpen,
    text,
    navigate,
    isLoading,
    setIsLoading,
  } = useAuthHook();

  // Form submission handler
  const onSubmit: SubmitHandler<SignUpSchemaType> = async (data) => {
    setIsLoading(true);
    try {
      // Calling signUpWithEmail with email and password from form data
      const successMessage = await signUpWithEmail(
        data.email,
        data.password,
        data.firstName,
        data.lastName
      );
      setSnackbarSeverity("success");
      setSnackbarMessage(successMessage || successfullyRegisteredMessage);
      setSnackbarOpen(true);
      reset();
      setIsLoading(false);
      setTimeout(() => {
        navigate(routes.auth.signIn);
      }, 2000);
    } catch (error: any) {
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || unexpectedErrorMessage);
      setIsLoading(false);
      setSnackbarOpen(true);
    }
  };
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={"calc(100vh - 134px)"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <Box sx={{ p: {xs: 3, md: "40px"}, m: "auto",...getMaxHeight(),overflowY: "auto" }} className="auth-form">
          <Typography align="center" variant="h3">
            {text.signupPageText}
          </Typography>
          <Typography
            align="center"
            variant="bodyLargeRegular"
            sx={{ my: 1 }}
            color="grey.600"
          >
            {text.subtitle}
          </Typography>
          <Grid container spacing={2} my={3}>
            <Grid size={{xs: 12, md: 6}}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={GoogleIcon}
                onClick={signInWithGoogle}
                sx={{ py: 1.5 }}
              >
                <Typography variant="bodyLargeMedium">
                  {text.googleSignInButton}
                </Typography>
              </Button>
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={AppleIcon}
                onClick={signInWithApple}
                sx={{ py: 1.5 }}
              >
                <Typography variant="bodyLargeMedium">
                  {text.appleSignInButton}
                </Typography>
              </Button>
            </Grid>
          </Grid>
          {/* <Box sx={{ display: "flex" }} gap={2} my={3}>
            <Button
              variant="outlined"
              startIcon={GoogleIcon}
              onClick={signInWithGoogle}
              sx={{ py: 1.5 }}
            >
              <Typography variant="bodyLargeMedium">
                {text.googleSignInButton}
              </Typography>
            </Button>
            <Button
              variant="outlined"
              startIcon={AppleIcon}
              onClick={signInWithApple}
              sx={{ py: 1.5 }}
            >
              <Typography variant="bodyLargeMedium">
                {text.appleSignInButton}
              </Typography>
            </Button>
          </Box> */}
          <Divider>
            <Typography variant="bodyLargeRegular" color="grey.600">
              {text.orText}
            </Typography>
          </Divider>
          {/* Input fields */}
          <Box my={4}>
            <Grid container spacing={2}>
              <Grid size={6}>
                <CommonTextField
                  fullWidth
                  placeholder="First name"
                  register={register("firstName")}
                  errorMessage={errors.firstName?.message}
                />
              </Grid>
              <Grid size={6}>
                <CommonTextField
                  fullWidth
                  placeholder="Last name"
                  register={register("lastName")}
                  errorMessage={errors.lastName?.message}
                />
              </Grid>
            </Grid>

            <Box mt={3}>
              <CommonTextField
                placeholder="Email"
                register={register("email")}
                errorMessage={errors.email?.message}
              />
            </Box>
            <Box mt={2}>
              <OutlinedInput
                {...register("password")}
                error={!!errors.password?.message}
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                fullWidth
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label={
                        showPassword
                          ? "hide the password"
                          : "display the password"
                      }
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      onMouseUp={handleMouseUpPassword}
                      edge="end"
                    >
                      {showPassword ? VisibilityOff : Visibility}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText>
                {errors.password && errors.password.message}
              </FormHelperText>
            </Box>

            <Box mt={3}>
              <Typography variant="bodyMediumMedium" color="grey.600">
                {text.privacyPolicyText}{" "}
                <CommonLink
                  to={externalLinks.privacyPolicy}
                  variant="bodyMediumExtraBold"
                  sx={{ textDecoration: "none", color: "secondary.main" }}
                >
                  {text.privacyPolicyLink}
                </CommonLink>
                , and{" "}
                <CommonLink
                  to={externalLinks.termsOfService}
                  variant="bodyMediumExtraBold"
                  sx={{ textDecoration: "none", color: "secondary.main" }}
                >
                  {text.ElectronicsPolicyText}
                </CommonLink>
              </Typography>
            </Box>
          </Box>

          <Box mt={3}>
            <CommonButton
              loading={isLoading}
              text={text.signUpButton}
              type="submit"
              fullWidth
            />
          </Box>

          <Typography mt={4} align="center" variant="bodyLargeMedium">
            {text.signupText}{" "}
            <CommonLink
              to={routes.auth.signIn}
              variant="bodyLargeExtraBold"
              sx={{ textDecoration: "none", color: "secondary.main" }}
            >
              {text.signInButton}
            </CommonLink>
          </Typography>
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
  );
};

export default SignUpForm;
