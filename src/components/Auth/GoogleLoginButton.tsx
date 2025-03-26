import { Button, CircularProgress, Typography } from "@mui/material";
import { signInWithGoogle } from "../../firebase/AuthService";
import { useAuthHook } from "../../hooks/useAuth";
import { useAuth } from "../../store/AuthContext";
import { routes } from "../../utils/links";
import { GoogleIcon } from "../../utils/Icons";
import { useState } from "react";

const GoogleSignInButton = () => {
  const { text, navigate } = useAuthHook();
  const [loading, setLoading] = useState(false);
  const { setUserDetails } = useAuth(); // ✅ Get setUserDetails from context
  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle(setUserDetails, setLoading);
      setTimeout(() => {
        navigate(routes.sidebar.bookings.link);
      }, 500);
    } catch (error: any) {
      console.error("Google Sign-In Failed:", error.message);
    }
  };

  return (
    <>
      <Button
        fullWidth
        variant="outlined"
        startIcon={loading ? <></> : GoogleIcon} // ✅ Ensure GoogleIcon is a React component
        onClick={handleGoogleSignIn} // ✅ Use the wrapped function
        disabled={loading}
        sx={{
          py: 1,
        }}
      >
        {loading ? (
          <CircularProgress size={24} />
        ) : (
          <Typography
            sx={{
              clear: "both",
              display: "inline-block",
              overflow: "hidden",
              whiteSpace: "nowrap",
              textOverflow: "ellipsis",
            }}
            variant="bodyMediumMedium"
          >
            {text.googleSignInButton}
          </Typography>
        )}
      </Button>
    </>
  );
};

export default GoogleSignInButton;
