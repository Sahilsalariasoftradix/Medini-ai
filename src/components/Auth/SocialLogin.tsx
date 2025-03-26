import Grid from "@mui/material/Grid2";
import GoogleSignInButton from "./GoogleLoginButton";
import AppleLoginButton from "./AppleLoginButton";

const isAppleDevice = /Mac|iPhone|iPod|iPad/.test(navigator.userAgent);

const SocialLogin = () => {
  return (
    <Grid container spacing={2} my={1} justifyContent={"center"}>
      <Grid size={{ xs: 6 }}>
        <GoogleSignInButton />
      </Grid>
      {isAppleDevice && (
        <Grid size={{ xs: 6 }}>
          <AppleLoginButton />
        </Grid>
      )}
    </Grid>
  );
};

export default SocialLogin;
