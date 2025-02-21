import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { routes } from "../utils/links";
import PageLoader from "../components/Loading/PageLoader";

const GuestRoute = () => {
  const { user ,loading} = useAuth();

  if (loading) {
    return <PageLoader />;
  }
  return user ? <Navigate to={routes.sidebar.bookings.link} replace /> : <Outlet />;
  // return <Outlet />;
};

export default GuestRoute;
