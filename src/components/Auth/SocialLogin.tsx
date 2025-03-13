import Grid from "@mui/material/Grid2";
import GoogleSignInButton from "./GoogleLoginButton";
import AppleLoginButton from "./AppleLoginButton";

const isAppleDevice = /Mac|iPhone|iPod|iPad/.test(navigator.userAgent);

const SocialLogin = ({
  setLoadingSocialLogin,
}: {
  setLoadingSocialLogin: (loading: boolean) => void;
}) => {
  return (
    <Grid container spacing={2} my={3}>
      <Grid size={{ xs: 12, md: isAppleDevice ? 6 : 12 }}>
        <GoogleSignInButton setLoadingSocialLogin={setLoadingSocialLogin} />
      </Grid>
      {isAppleDevice && (
        <Grid size={{ xs: 12, md: 6 }}>
          <AppleLoginButton />
        </Grid>
      )}
    </Grid>
  );
};

export default SocialLogin;
