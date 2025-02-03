import { Outlet, useLocation } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Sidebar, { drawerWidth } from "../components/sidebar/Sidebar";

const MainLayout = () => {
  const location = useLocation(); // This hook provides the current route
  const [open, setOpen] = useState(true); // Sidebar state
  const [nestedOpen, setNestedOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNestedMenuToggle = () => {
    setNestedOpen(!nestedOpen);
  };
  // Function to check if the route is active
  const isActive = (link: string) => location.pathname === link;

  const toggleDrawer = () => {
    setOpen(!open);
  };
  const closeDrawerOnMobile = () => {
    if (isMobile) setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Header */}
      <AppBar
        position="fixed"
        sx={{
          width: isMobile
            ? "100%"
            : `calc(100% - ${open ? drawerWidth : 80}px)`,
          transition: "0.3s",
          borderRadius: 0,
        }}
      >
        <Toolbar>
          <Button onClick={toggleDrawer}>{open ? "opem" : "sasas"}</Button>
          <Typography variant="h6" noWrap>
            My Dashboard
            <Button onClick={toggleDrawer}>{open ? "opem" : "sasas"}</Button>
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Sidebar
        open={open}
        nestedOpen={nestedOpen}
        isMobile={isMobile}
        handleNestedMenuToggle={handleNestedMenuToggle}
        isActive={isActive}
        closeDrawerOnMobile={closeDrawerOnMobile}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: isMobile
            ? "100%"
            : `calc(100% - ${open ? drawerWidth : 80}px)`,
          transition: "0.3s",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
