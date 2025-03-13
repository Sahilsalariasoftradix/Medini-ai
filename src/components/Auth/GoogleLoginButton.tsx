import { Button, Typography } from "@mui/material";
import { signInWithGoogle } from "../../firebase/AuthService";
import { useAuthHook } from "../../hooks/useAuth";
import { useAuth } from "../../store/AuthContext";
import { routes } from "../../utils/links";
import { GoogleIcon } from "../../utils/Icons";


const GoogleSignInButton: React.FC<{setLoadingSocialLogin: (loading: boolean) => void}> = ({setLoadingSocialLogin}) => {
  const { text, navigate } = useAuthHook();
  const { setUserDetails } = useAuth(); // ✅ Get setUserDetails from context
  const handleGoogleSignIn = async () => {
    setLoadingSocialLogin(true);
    try {
      await signInWithGoogle(setUserDetails);
      setTimeout(() => {
        navigate(routes.sidebar.bookings.link);
      }, 2000);
    } catch (error: any) {
      console.error("Google Sign-In Failed:", error.message);
    } finally {
      setLoadingSocialLogin(false);
    }
  };

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        startIcon={GoogleIcon} // ✅ Ensure GoogleIcon is a React component
        onClick={handleGoogleSignIn} // ✅ Use the wrapped function
        sx={{
          py: 1.5,
        }}
      >
        <Typography
          sx={{
            clear: "both",
            display: "inline-block",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
          variant="bodyLargeMedium"
        >
          {text.googleSignInButton}
        </Typography>
      </Button>
    </>
  );
};

export default GoogleSignInButton;
