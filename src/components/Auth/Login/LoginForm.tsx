// MUI imports
import {
  Box,
  Button,
  Divider,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
  Typography,
} from "@mui/material";
// Validation packages
import { zodResolver } from "@hookform/resolvers/zod"; // Import zodResolver
import { SubmitHandler, useForm } from "react-hook-form";
// Local imports
import "../../../styles/_auth-form.scss";
import googleIcon from "../../../assets/icons/google-icon.svg";
import appleIcon from "../../../assets/icons/apple-icon.svg";
import hidden from "../../../assets/icons/eye-off.svg";
import visibile from "../../../assets/icons/eye-on.svg";
import {
  SignInSchema,
  SignInSchemaType,
  useAuthHook,
} from "../../../hooks/useAuth";
import {
  getOnboardingStatus,
  signInWithEmail,
} from "../../../firebase/AuthService";
import { RoundCheckbox } from "../../common/RoundCheckbox";
import CommonButton from "../../common/CommonButton";
import CommonLink from "../../common/CommonLink";
import { routes } from "../../../utils/links";
import CommonSnackbar from "../../common/CommonSnackbar";
import {
  credentialsRequiredMessage,
  unexpectedErrorMessage,
} from "../../../utils/errorHandler";
import { firebaseAuth } from "../../../firebase/BaseConfig";
// Static Icons
const GoogleIcon = <img alt="edit" src={googleIcon} />;
const AppleIcon = <img alt="edit" src={appleIcon} />;
const VisibilityOff = <img alt="edit" src={hidden} />;
const Visibility = <img alt="edit" src={visibile} />;
const LoginForm = () => {
  // Validate hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignInSchemaType>({ resolver: zodResolver(SignInSchema) });
  const {
    showPassword,
    handleClickShowPassword,
    handleMouseDownPassword,
    handleMouseUpPassword,
    checked,
    snackbarOpen,
    setSnackbarOpen,
    snackbarMessage,
    setSnackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
    setSnackbarSeverity,
    handleChangeCheckbox,
    text,
    isLoading,
    setIsLoading,
    navigate,
  } = useAuthHook();

  const onSubmit: SubmitHandler<SignInSchemaType> = async (data) => {
    setIsLoading(true);

    //* Check if email and password are not empty
    if (data.email === "" || data.password === "") {
      setSnackbarSeverity("error");
      setSnackbarMessage(credentialsRequiredMessage);
      setIsLoading(false);
      return;
    }

    try {
      const message = await signInWithEmail(data.email, data.password);
      setSnackbarSeverity("success");
      setSnackbarMessage(message);
      setSnackbarOpen(true);
      reset();
      // Step 2: Fetch onboarding status after successful sign-in
      const userId = firebaseAuth.currentUser?.uid; // Get the current user's UID
      if (!userId) {
        throw new Error("User ID not found.");
      }

      const onboardingStatus = await getOnboardingStatus(userId);

      // Step 3: Route based on the onboarding status
      if (onboardingStatus === 0) {
        setIsLoading(false);
        setTimeout(() => {
          navigate(routes.auth.stepForm, { replace: true });
        }, 500);
      } else if (onboardingStatus === 1) {
        // If onboardingStatus is 1, route to the home page
        setIsLoading(false);
        setTimeout(() => {
          navigate(routes.dashboard.home, { replace: true });
        }, 500);
      } else if (onboardingStatus === 2) {
        // If onboardingStatus is 2, route to a "completed onboarding" page or any other route
        setIsLoading(false);
        // navigate(routes.dashboard.home, { replace: true });
      } else {
        // If the status is an unexpected value, handle that case (optional)
        throw new Error("Invalid onboarding status.");
      }
    } catch (error: any) {
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || unexpectedErrorMessage);
      setSnackbarOpen(true);
      setIsLoading(false);
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
        <Box sx={{ p: "40px", m: "auto" }} className="auth-form">
          <Typography align="center" variant="h3">
            {text.title}
          </Typography>
          <Typography
            align="center"
            variant="bodyLargeRegular"
            sx={{ my: 1 }}
            color="grey.600"
          >
            {text.subtitle}
          </Typography>
          <Box sx={{ display: "flex" }} gap={2} my={3}>
            <Button variant="outlined" startIcon={GoogleIcon} sx={{ py: 1.5 }}>
              <Typography variant="bodyLargeMedium">
                {text.googleSignInButton}
              </Typography>
            </Button>
            <Button variant="outlined" startIcon={AppleIcon} sx={{ py: 1.5 }}>
              <Typography variant="bodyLargeMedium">
                {text.appleSignInButton}
              </Typography>
            </Button>
          </Box>
          <Divider>
            <Typography variant="bodyLargeRegular" color="grey.600">
              {text.orText}
            </Typography>
          </Divider>
          {/* Input fields */}
          <Box my={4}>
            <Box mt={3}>
              <TextField fullWidth placeholder="Email" {...register("email")} />
              <FormHelperText>
                {errors.email && errors.email.message}
              </FormHelperText>
            </Box>
            <Box mt={2}>
              <OutlinedInput
                {...register("password")}
                placeholder="Password"
                // id="outlined-adornment-password"
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
          </Box>
          <Box
            mt={2}
            sx={{ display: "flex" }}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <RoundCheckbox
              label="Remember me"
              checked={checked}
              onChange={handleChangeCheckbox}
            />
            <CommonLink
              to={routes.auth.forgotPassword}
              variant="bodyLargeSemiBold"
            >
              {text.forgotPassword}
            </CommonLink>
          </Box>
          <Box mt={3}>
            <CommonButton
              loading={isLoading}
              text={text.signInButton}
              type="submit"
              fullWidth
            />
          </Box>

          <Typography mt={4} align="center" variant="bodyLargeMedium">
            {text.signupText}{" "}
            <CommonLink
              to={routes.auth.signUp}
              variant="bodyLargeExtraBold"
              sx={{ textDecoration: "none", color: "secondary.main" }}
            >
              {text.signupLink}
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

export default LoginForm;
