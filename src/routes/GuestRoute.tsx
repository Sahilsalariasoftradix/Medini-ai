import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../store/AuthContext";
import { routes } from "../utils/links";

const GuestRoute = () => {
  const { user } = useAuth();

//  
// return user ? <Navigate to={routes.auth.stepForm} replace /> : <Outlet />;
return <Outlet />;
};

export default GuestRoute;
