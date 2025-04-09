import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Menu,
  MenuItem,
  Avatar,
  Container,
} from "@mui/material";
import { drawerWidth } from "../sidebar/Sidebar";
import { IHeaderProps } from "../../utils/Interfaces";
// import bell from "../../assets/icons/notifications.svg";
import { useState } from "react";
import down from "../../assets/icons/arrow-down.svg";
// import profile1 from "../../assets/images/profile-1.svg";
import profile2 from "../../assets/images/profile-2.svg";
import { useAuth } from "../../store/AuthContext";
import { useLocation } from "react-router-dom";
import { getPageNameFromPath } from "../../utils/common";
import CommonDialog from "../common/CommonDialog";

const Header = ({ isMobile, open }: Omit<IHeaderProps, "pageName">) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const pageName = getPageNameFromPath(location.pathname);
  const openMenu = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const { userDetails: userInfo, logout } = useAuth();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  return (
    <AppBar
      position="fixed"
      sx={{
        width: isMobile ? "100%" : `calc(100% - ${open ? drawerWidth : 80}px)`,
        transition: "0.3s",
        borderRadius: 0,
        backgroundColor: "#fff",
        boxShadow: "none",
      }}
    >
      <Container disableGutters maxWidth="xl" sx={{ m: 0 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h4" color="secondary.main" noWrap>
            {pageName}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* <IconButton>
              <img src={bell} alt="bell" />
            </IconButton> */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                cursor: "pointer",
                borderRadius: 28,
                bgcolor: "grey.50",
                py: 1,
                px: 1,
                "&:hover": {
                  bgcolor: "grey.200",
                },
              }}
              onClick={handleClick}
            >
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                }}
                src={profile2}
              />
              <Typography variant="bodyLargeExtraBold" color="secondary.main">
                {userInfo ? userInfo.firstName : "Username"}
              </Typography>
              <IconButton
                size="small"
                sx={{
                  p: 0,
                }}
              >
                <img src={down} alt="down" />
              </IconButton>
            </Box>
            <Menu
              anchorEl={anchorEl}
              open={openMenu}
              onClose={handleClose}
              onClick={handleClose}
              slotProps={{
                paper: {
                  elevation: 0,
                  sx: {
                    py: 0,
                    px: 0,
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    // mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              {/* <MenuItem onClick={() => (window.location.href = "/profile")}>
                Profile
              </MenuItem>
              <MenuItem onClick={() => (window.location.href = "/profile")}>
                Settings
              </MenuItem> */}
              <MenuItem
                onClick={() => {
                  // Handle logout
                  setIsLogoutModalOpen(true);
                }}
                sx={{
                  color: "error.main",
                  bgcolor: "transparent",
                  "&:hover": { bgcolor: "transparent" },
                  "&:focus": { bgcolor: "transparent" },
                }}
              >
                Logout
              </MenuItem>
            </Menu>
            <CommonDialog
              open={isLogoutModalOpen}
              onClose={() => setIsLogoutModalOpen(false)}
              confirmButtonType="error"
              confirmText="Logout"
              onConfirm={() => {
                setIsLogoutModalOpen(false);
                logout();
              }}
              cancelText="Cancel"
              title="Logout"
            >
              <Typography variant="bodyLargeExtraBold" color="grey.600">
                Are you sure you want to logout?
              </Typography>
            </CommonDialog>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
