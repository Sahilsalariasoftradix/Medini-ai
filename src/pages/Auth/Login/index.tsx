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
import { Link as RouterLink} from "react-router-dom";

// Local imports
import "../../../styles/_auth-form.scss";
import googleIcon from "../../../assets/icons/google-icon.svg";
import appleIcon from "../../../assets/icons/apple-icon.svg";
import hidden from "../../../assets/icons/eye-off.svg";
import visibile from "../../../assets/icons/eye-on.svg";
import { RoundCheckbox } from "../../../components/common/RoundCheckbox";
// Validation packages
import { zodResolver } from "@hookform/resolvers/zod"; // Import zodResolver
import { SubmitHandler, useForm } from "react-hook-form";
import { signInWithEmail } from "../../../firebase/AuthService";
import {
  SignInSchema,
  SignInSchemaType,
  useAuthHook,
} from "../../../hooks/useAuth";
// Static Icons
const GoogleIcon = <img alt="edit" src={googleIcon} />;
const AppleIcon = <img alt="edit" src={appleIcon} />;
const VisibilityOff = <img alt="edit" src={hidden} />;
const Visibility = <img alt="edit" src={visibile} />;

const Login = () => {
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
    text
  } = useAuthHook();
  // Submit handler
  const onSubmit: SubmitHandler<SignInSchemaType> = async (data) => {
    try {
      const message=await signInWithEmail(data.email, data.password);
      setSnackbarSeverity("success");
      setSnackbarMessage(message);
      setSnackbarOpen(true);
      reset();
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
            <Link
              component={RouterLink}
              to="/forgot/password"
              variant="bodyLargeSemiBold"
              sx={{ textDecoration: "none" }}
            >
              {text.forgotPassword}
            </Link>
          </Box>
          <Box mt={3}>
            <Button variant="contained" type="submit" sx={{ p: 1.5 }} fullWidth>
              {text.signInButton}
            </Button>
          </Box>

          <Typography mt={4} align="center" variant="bodyLargeMedium">
            {text.signupText}{" "}
            <Link
              component={RouterLink}
              to="/sign-up"
              variant="bodyLargeExtraBold"
              sx={{ textDecoration: "none", color: "secondary.main" }}
            >
              {text.signupLink}
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

export default Login;
