// MUI imports
import {
  Box,
  CircularProgress,
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

import {
  SignInSchema,
  SignInSchemaType,
  useAuthHook,
} from "../../../hooks/useAuth";
import { signInWithEmail } from "../../../firebase/AuthService";
import { RoundCheckbox } from "../../common/RoundCheckbox";
import CommonButton from "../../common/CommonButton";
import CommonLink from "../../common/CommonLink";
import { routes } from "../../../utils/links";
import CommonSnackbar from "../../common/CommonSnackbar";
import { unexpectedErrorMessage } from "../../../utils/errorHandler";
import { useState } from "react";
import { getMaxHeight } from "../../../utils/common";
import SocialLogin from "../SocialLogin";
import { Visibility, VisibilityOff } from "../../../utils/Icons";

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
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

    navigate,
  } = useAuthHook();

  const onSubmit: SubmitHandler<SignInSchemaType> = async (data) => {
    try {
      setLoading(true);
      await signInWithEmail(data.email, data.password);
      navigate("/");

      // Don't set loading false here - let the redirect handle it
    } catch (error: any) {
      setLoading(false);
      // Show error message
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message || unexpectedErrorMessage);
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
      {false ? (
        <Box
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent={"center"}
          height={"100%"}
        >
          <CircularProgress />
          <Typography variant="bodyLargeSemiBold" mt={2} color="grey.600">
            We are signing you in please do not close the tab
          </Typography>
        </Box>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <Box
            sx={{
              px: "40px",
              py: "20px",
              m: "auto",
              ...getMaxHeight(),
              minWidth: { lg: "500px", md: "500px", sm: "500px", xs: "100%" },
              overflowY: "auto",
            }}
            className="auth-form"
          >
            <Typography align="center" variant="h3" sx={{ fontSize: { xs: "20px", md: "28px" } }}>
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
            <SocialLogin />
            <Divider>
              <Typography variant="bodyLargeRegular" color="grey.600">
                {text.orText}
              </Typography>
            </Divider>
            {/* Input fields */}
            <Box my={3}>
              <Box mt={3}>
                <TextField
                  fullWidth
                  placeholder="Email"
                  {...register("email")}
                />
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
              mt={1}
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
            <Box mt={2}>
              <CommonButton
                loading={loading}
                text={text.signInButton}
                type="submit"
                fullWidth
              />
            </Box>

            <Typography mt={2} align="center" variant="bodyLargeMedium">
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
      )}
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
