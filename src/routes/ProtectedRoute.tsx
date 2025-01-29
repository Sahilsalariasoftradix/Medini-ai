import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";
import { useAuth } from "../store/AuthContext";
import { routes } from "../utils/links";

const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!user) return <Navigate to={routes.auth.signIn} replace />;
  //   if (!user.emailVerified) return <Navigate to="/verify-email" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
