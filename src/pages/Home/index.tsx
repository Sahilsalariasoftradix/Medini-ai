import {  useNavigate } from "react-router-dom";
import CommonButton from "../../components/common/CommonButton";
import { useAuth } from "../../store/AuthContext";
import { routes } from "../../utils/links";

const Home = () => {
  const navigate = useNavigate();
  const {  logout } = useAuth(); // Get user and logout function
  const handleLogout = async () => {
    try {
      await logout();
      navigate(routes.auth.signIn); // Redirect to sign-in after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
    return (
      <div>
        Welcome to the Home Page!
        Home
        <CommonButton
            variant="contained"
            color="secondary"
            sx={{ height: "56px", width: "150px" }}
            text={"Logout"}
            type="button"
            onClick={handleLogout} // Logout action
          />
      </div>
    )
  }
  
  export default Home;