// MUI imports
import {
  Box,
  CircularProgress,
  Divider,
  FormHelperText,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Typography,
} from "@mui/material";
// Local imports
import "../../../styles/_auth-form.scss";

// Validation packages
import { zodResolver } from "@hookform/resolvers/zod"; // Import zodResolver
import { SubmitHandler, useForm } from "react-hook-form";
import { signUpWithEmail } from "../../../firebase/AuthService";

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
import { Visibility, VisibilityOff } from "../../../utils/Icons";
import SocialLogin from "../SocialLogin";
import { useState } from "react";
import { IUser } from "../../../utils/Interfaces";
import { createUser } from "../../../api/userApi";
import { EnUserCreationStatus } from "../../../utils/enums";
import "react-international-phone/style.css";
import { MuiPhone } from "./CustomPhoneInput";

const SignUpForm = () => {
  const [phone, setPhone] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
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
    setFormSubmitted(true);
    if ( phone.length < 10) {
      setSnackbarSeverity("error");
      setSnackbarMessage("Please enter a valid phone number");
      setSnackbarOpen(true);
      return;
    }
    
    setIsLoading(true);
    try {
      const userData: IUser = {
        first_name: data.firstName,
        last_name: data.lastName,
        email: data.email,
        phone: phone,
        password: data.password,
      };

      const responseData = await createUser(userData);

      // Ensure response is valid before proceeding
      if (
        responseData &&
        responseData.message === EnUserCreationStatus.SUCCESS
      ) {
     
        const successMessage = await signUpWithEmail(
          data.email,
          data.password,
          data.firstName,
          data.lastName,
          responseData.user.user_id
        );
        setSnackbarSeverity("success");
        setSnackbarMessage(successMessage || successfullyRegisteredMessage);
        setSnackbarOpen(true);
        reset();
        setIsLoading(false);
        setTimeout(() => {
          navigate(routes.auth.signIn);
        }, 2000);
      } else {
        throw new Error("Failed to create user.");
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
              px: { xs: 3, md: "40px" },
              py: { xs: 3, md: "20px" },
              m: "auto",
              ...getMaxHeight(),
              overflowY: "auto",
            }}
            className="auth-form"
          >
            <Typography align="center" variant="h3" sx={{ fontSize: { xs: "20px", md: "28px" } }}>
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
            <SocialLogin />
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
                <MuiPhone 
                  error={formSubmitted && (!phone || phone.length < 10)} 
                  value={phone} 
                  onChange={(phone) => setPhone(phone)} 
                />
              </Box>
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

export default SignUpForm;
