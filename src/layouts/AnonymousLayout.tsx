import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import AuthHeader from "../components/Header/AuthHeader";

const AnonymousLayout = () => {
  return (
    <Box sx={{ bgcolor: "grey.200", height: "100vh" }}>
      <AuthHeader />
      <Outlet />
    </Box>
  );
};

export default AnonymousLayout;
