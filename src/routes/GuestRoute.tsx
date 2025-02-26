import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { routes } from "../utils/links";
import PageLoader from "../components/Loading/PageLoader";
import { EnOnboardingStatus } from "../utils/enums";

const GuestRoute = () => {
  const { user, loading, userDetails } = useAuth();

  if (loading  ) {
    return <PageLoader />;
  }

  // Only redirect if user is fully authenticated and onboarded
  if (user && userDetails?.onboardingStatus === EnOnboardingStatus.STATUS_2) {
    return <Navigate to={routes.sidebar.bookings.link} replace />;
  }

  return <Outlet />;
};

export default GuestRoute;
