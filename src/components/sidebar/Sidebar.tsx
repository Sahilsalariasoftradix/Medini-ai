import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Icon,
  Badge,
} from "@mui/material";
import { SidebarIcons } from "../../utils/Icons";
import { Link } from "react-router-dom";
import { externalLinks, routes } from "../../utils/links";
import { overRideSvgColor } from "../../utils/filters";
import CommonLink from "../common/CommonLink";
export const drawerWidth = 240;
const Sidebar = ({
  open,
  isMobile,
  isActive,
  closeDrawerOnMobile,
}: {
  open: boolean;
  nestedOpen: boolean;
  isMobile: boolean;
  handleNestedMenuToggle: () => void;
  isActive: (link: string) => boolean;
  closeDrawerOnMobile: () => void;
}) => {
  const drawerStyles = {
    width: open ? drawerWidth : isMobile ? 0 : 80,
    position: "relative",
    flexShrink: 0,
    transition: "width 0.3s",
    "& .MuiDrawer-paper": {
      width: open ? drawerWidth : isMobile ? 0 : 80,
      borderRadius: 0,
      borderColor: "transparent",
      boxShadow: "none",
      transition: "width 0.3s",
      overflow: "visible !important",
      justifyContent: "center",
      backgroundColor: "#FAFAFA",
    },
  };
  const listItemStyles = { alignItems: "center", gap: 2 };
  // const nestedListItemTextStyles = {
  //   "&.MuiListItemText-root span": { fontSize: "12px" },
  // };
  const listContainerStyles = {
    height: "calc(100vh - 70px)",
    boxShadow: "0px 5px 10px 0px #0000001A",
    position: "absolute",
    background: "#fff",
    borderRadius: "16px",
    right: "-10px",
    p: 2,
    border: "2px solid #E2E8F0",
  };
  const renderListItem = (
    iconSrc?: string,
    text?: string,
    badgeContent?: number,
    link?: string
  ) => (
    <ListItem
      sx={{
        ...listItemStyles,
        pl: iconSrc ? 1 : 5.5,
        backgroundColor: link && isActive(link) ? "#358FF7" : "transparent",
        color: link && isActive(link) ? "#fff" : "#718096",
        "& img": {
          filter: link && isActive(link) ? overRideSvgColor.white : "",
          transition: "filter 0.3s", // Smooth transition for image color change
        },
      }}
      component={link ? Link : "div"}
      to={link || "#"}
      onClick={closeDrawerOnMobile}
    >
      {iconSrc && <img alt={"logo"} src={iconSrc} />}
      <ListItemText primary={text} />
      {badgeContent && <Badge badgeContent={badgeContent} color="primary" />}
    </ListItem>
  );

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      sx={drawerStyles}
    >
      {/* <Toolbar /> */}
      <List sx={listContainerStyles}>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"space-between"}
          height={"100%"}
          sx={{
            "&::before": {
              width: "80px",
              content: '""',
              position: "absolute",
              zIndex: -3,
              borderRadius: "30px",
              height: "80px",
              top: "-25px",
              background: "#358FF7",
            },
          }}
        >
          <Box>
            <Box sx={{ px: 0, mb: 4, mt: 2 }}>
              <Icon sx={{ width: 200, height: 35 }}>
                <img alt="edit" src={SidebarIcons.logo} />
              </Icon>
            </Box>
            {renderListItem(
              SidebarIcons.home,
              "Schedule",
              undefined,
              routes.sidebar.schedule.link
            )}
            {renderListItem(
              undefined,
              "Bookings",
              undefined,
              routes.sidebar.bookings.link
            )}
            {renderListItem(
              undefined,
              "Call Center",
              undefined,
              routes.sidebar.callCenter.link
            )}
            {/* Nested Menu */}
            {/* <ListItem
              sx={{ ...listItemStyles, pl: 1 }}
              onClick={handleNestedMenuToggle}
            >
              <img alt="edit" src={SidebarIcons.activity} />
              {open && <ListItemText primary="Activity" />}
              {open && (
                <img
                  alt="edit"
                  src={SidebarIcons.arrow}
                  className={nestedOpen ? "rotate" : ""}
                />
              )}
            </ListItem> */}

            {/* <Collapse in={nestedOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {renderListItem(
                  undefined,
                  "Activity 1",
                  undefined,
                  routes.sidebar.activity1.link
                )}
                {renderListItem(
                  undefined,
                  "Activity 2",
                  undefined,
                  routes.sidebar.activity2.link
                )}
              </List>
            </Collapse> */}

            {/* {renderListItem(
              SidebarIcons.billing,
              "Billing",
              undefined,
              routes.sidebar.billing.link
            )} */}
            {/* {renderListItem(
              SidebarIcons.patients,
              "Patients",
              undefined,
              routes.sidebar.patients.link
            )} */}
            {/* {renderListItem(
              SidebarIcons.history,
              "Task History",
              undefined,
              routes.sidebar.history.link
            )} */}
            {renderListItem(
              SidebarIcons.messages,
              "Messages",
              5,
              routes.sidebar.messages.link
            )}
          </Box>
          <Box>
            {renderListItem(
              SidebarIcons.settings,
              "Settings",
              undefined,
              "#"
            )}
            {renderListItem(
              SidebarIcons.help,
              "Get Help",
              undefined,
              "#"
            )}
            <Box display={"flex"} justifyContent={"space-between"} px={2}>
              <CommonLink to={externalLinks.termsOfService}>Terms</CommonLink>
              |
              <CommonLink to={externalLinks.privacyPolicy}>Privacy</CommonLink>
            </Box>
            
          </Box>
        </Box>
      </List>
    </Drawer>
  );
};

export default Sidebar;
