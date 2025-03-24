import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { routes } from "../utils/links";
import PageLoader from "../components/Loading/PageLoader";
import { EnOnboardingStatus } from "../utils/enums";

const GuestRoute = () => {
  const { user, loading, userDetails } = useAuth();
  const location = useLocation();

  if (loading) {
    return <PageLoader />;
  }

  // if user is not onboarded, redirect to onboarding page ONLY if verified
  if (
    user && 
    userDetails?.verified && // Only redirect verified users
    ((location.pathname === "/login" && userDetails?.onboardingStatus === EnOnboardingStatus.STATUS_0) ||
    userDetails?.onboardingStatus === EnOnboardingStatus.STATUS_0 ||
    userDetails?.onboardingStatus === EnOnboardingStatus.STATUS_1)
  ) {
    return <Navigate to={routes.auth.stepForm} replace />;
  }
  
  // Only redirect if user is fully authenticated and onboarded
  if (user && userDetails?.onboardingStatus === EnOnboardingStatus.STATUS_2) {
    return <Navigate to={routes.sidebar.bookings.link} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
