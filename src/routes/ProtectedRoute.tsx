import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { routes } from "../utils/links";
import PageLoader from "../components/Loading/PageLoader";
import { EnOnboardingStatus } from "../utils/enums";

const ProtectedRoute = () => {
  const { user, loading, userDetails } = useAuth();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) return <Navigate to={routes.auth.signIn} replace />;
  if (
    userDetails?.onboardingStatus === EnOnboardingStatus.STATUS_0 ||
    userDetails?.onboardingStatus === EnOnboardingStatus.STATUS_1
  ) {
    return <Navigate to={routes.auth.stepForm} replace />;
  }
  //   if (!user.emailVerified) return <Navigate to="/verify-email" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
