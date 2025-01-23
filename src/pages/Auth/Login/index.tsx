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
import Grid from "@mui/material/Grid2";
// React imports
import { useState } from "react";
import { Link } from "react-router-dom";
// Local imports
import "../../../styles/_auth-form.scss";
import googleIcon from "../../../assets/icons/google-icon.svg";
import appleIcon from "../../../assets/icons/apple-icon.svg";
import hidden from "../../../assets/icons/eye-off.svg";
import visibile from "../../../assets/icons/eye-on.svg";
import background from "../../../assets/images/Auth-bg.svg";
import { RoundCheckbox } from "../../../components/common/RoundCheckbox";
// Validation packages
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"; // Import zodResolver
import { SubmitHandler, useForm } from "react-hook-form";
// Static Icons
const GoogleIcon = <img alt="edit" src={googleIcon} />;
const AppleIcon = <img alt="edit" src={appleIcon} />;
const VisibilityOff = <img alt="edit" src={hidden} />;
const Visibility = <img alt="edit" src={visibile} />;

// Validation schema
const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});
// Type declaration for schema
type SignUpSchemaType = z.infer<typeof SignUpSchema>;
const Login = () => {
  // Validate hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpSchemaType>({ resolver: zodResolver(SignUpSchema) });
  // Show and hide password
  const [showPassword, setShowPassword] = useState<Boolean>(false);
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
  // Remember me checkbox
  const [checked, setChecked] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
  };
  // Form submission handler
  const onSubmit: SubmitHandler<SignUpSchemaType> = (data) => console.log(data);
  return (
    <Box 
      display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          minHeight={"calc(100vh - 104px)"}
    >
     
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <Box sx={{ p: "40px", m: "auto" }} className="auth-form">
              <Typography align="center" variant="h3">
                Sign in to Medini
              </Typography>
              <Typography
                align="center"
                variant="bodyLargeRegular"
                sx={{ my: 1 }}
                color="grey.600"
              >
                Something short and sweet
              </Typography>
              <Box sx={{ display: "flex" }} gap={2} my={3}>
                <Button variant="outlined" startIcon={GoogleIcon}>
                  Sign In with Google
                </Button>
                <Button variant="outlined" startIcon={AppleIcon}>
                  Sign In with Apple
                </Button>
              </Box>
              <Divider>
                <Typography variant="bodyLargeRegular" color="grey.600">
                  or with email
                </Typography>
              </Divider>
              {/* Input fields */}
              <Box>
                {/* <Box sx={{ display: "flex" }} gap={2}>
               <Box mt={2}>
                 <TextField label="" fullWidth placeholder="First name" />
               </Box>
               <Box mt={2}>
                 <TextField label="" fullWidth placeholder="Last name" />
               </Box>
             </Box> */}
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

              {/* <Typography variant="bodyMediumMedium" color="grey.600">
             By creating an account, you agreeing to our{" "}
             <Link to={"/privacy-policy"} className="link-style">Privacy Policy</Link>, and
             Electronics Communication Policy.
           </Typography> */}
              <Box
                mt={2}
                sx={{ display: "flex" }}
                justifyContent={"space-between"}
              >
                <RoundCheckbox
                  label="Remember me"
                  checked={checked}
                  onChange={handleChange}
                />
                <Link to={"forgot/password"}>Forgot Password?</Link>
              </Box>
              <Box mt={3}>
                <Button
                  variant="contained"
                  type="submit"
                  sx={{ p: 1.5 }}
                  fullWidth
                >
                  Sign In
                </Button>
              </Box>
              <Typography my={2} align="center" variant="bodyMediumMedium">
                Don’t have an account? Sign Up
              </Typography>
            </Box>
          </form>
      
    </Box>
  );
};

export default Login;
