// MUI imports
import {
  Alert,
  Box,
  Button,
  Divider,
  FormHelperText,
  IconButton,
  InputAdornment,
  Link,
  OutlinedInput,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
// React imports
import { Link as RouterLink, useOutletContext } from "react-router-dom";
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
// Static Icons
const GoogleIcon = <img alt="edit" src={googleIcon} />;
const AppleIcon = <img alt="edit" src={appleIcon} />;
const VisibilityOff = <img alt="edit" src={hidden} />;
const Visibility = <img alt="edit" src={visibile} />;

const SignUp = () => {
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
    navigate
  } = useAuthHook();

  // Form submission handler
  const onSubmit: SubmitHandler<SignUpSchemaType> = async (data) => {
    try {
      // Calling signUpWithEmail with email and password from form data
      const successMessage = await signUpWithEmail(
        data.email,
        data.password,
        data.firstName,
        data.lastName
      );
      setSnackbarSeverity("success");
      setSnackbarMessage(successMessage || "Successfully registered!");
      setSnackbarOpen(true);
      reset();
      // navigate('/login')
    } catch (error: any) {
      setSnackbarSeverity("error");
      setSnackbarMessage(
        error.message || "An error occurred. Please try again."
      );
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
        <Box sx={{ p: "40px", m: "auto" }} className="auth-form">
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
          <Box sx={{ display: "flex" }} gap={2} my={3}>
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
          </Box>
          <Divider>
            <Typography variant="bodyLargeRegular" color="grey.600">
              {text.orText}
            </Typography>
          </Divider>
          {/* Input fields */}
          <Box my={4}>
            <Box sx={{ display: "flex" }} gap={2}>
              <Box>
                <TextField
                  {...register("firstName")}
                  label=""
                  fullWidth
                  placeholder="First name"
                />
                <FormHelperText>
                  {errors.firstName && errors.firstName.message}
                </FormHelperText>
              </Box>
              <Box>
                <TextField
                  {...register("lastName")}
                  label=""
                  fullWidth
                  placeholder="Last name"
                />
                <FormHelperText>
                  {errors.lastName && errors.lastName.message}
                </FormHelperText>
              </Box>
            </Box>
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
                <Link
                  component={RouterLink}
                  to="/privacy-policy"
                  variant="bodyMediumExtraBold"
                  sx={{ textDecoration: "none", color: "secondary.main" }}
                >
                  {text.privacyPolicyLink}
                </Link>
                , and{" "}
                <Link
                  component={RouterLink}
                  to="/sign-up"
                  variant="bodyMediumExtraBold"
                  sx={{ textDecoration: "none", color: "secondary.main" }}
                >
                  {text.ElectronicsPolicyText}
                </Link>
              </Typography>
            </Box>
          </Box>

          <Box mt={3}>
            <Button variant="contained" type="submit" sx={{ p: 1.5 }} fullWidth>
              {text.signUpButton}
            </Button>
          </Box>

          <Typography mt={4} align="center" variant="bodyLargeMedium">
            {text.signupText}{" "}
            <Link
              component={RouterLink}
              to="/login"
              variant="bodyLargeExtraBold"
              sx={{ textDecoration: "none", color: "secondary.main" }}
            >
              {text.signInButton}
            </Link>
          </Typography>
        </Box>
      </form>
      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SignUp;
