import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Box, CssBaseline, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem, ListItemIcon, ListItemText, Button, useMediaQuery, useTheme } from "@mui/material";
import { Theme } from "@emotion/react";

const drawerWidth = 240;

const MainLayout = () => {
  const [open, setOpen] = useState(true); // Sidebar state

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Header */}
      <AppBar position="fixed" sx={{ width: isMobile ? "100%" : `calc(100% - ${open ? drawerWidth : 60}px)`, transition: "0.3s" }}>
        <Toolbar>
          <Button  onClick={toggleDrawer} >
          {open ? "opem" : "sasas"}
          </Button>
          <Typography variant="h6" noWrap>
            My Dashboard
            <Button  onClick={toggleDrawer} >
          {open ? "opem" : "sasas"}
          </Button>
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
       variant={isMobile ? "temporary" : "permanent"} // Temporary for mobile, Permanent for desktop
        open={open}
        sx={{
          width: open ? drawerWidth : (isMobile ? 0 : 60),
          flexShrink: 0,
          transition: "width 0.3s",
          "& .MuiDrawer-paper": { width: open ? drawerWidth : (isMobile ? 0 : 60), transition: "width 0.3s" },
        }}
      >
        <Toolbar />
        <List>
          <ListItem >
            {/* <ListItemIcon><Home /></ListItemIcon> */}
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem >
            {/* <ListItemIcon><Dashboard /></ListItemIcon> */}
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem >
            {/* <ListItemIcon><Logout /></ListItemIcon> */}
            <ListItemText primary="Logout" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: isMobile ? "100%" : `calc(100% - ${open ? drawerWidth : 60}px)`, transition: "0.3s" }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
