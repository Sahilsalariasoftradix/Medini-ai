import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import MoreVertIcon from "../../assets/icons/dots-vertical.svg";
import edit from "../../assets/icons/edit-table.svg";
import deleteIcn from "../../assets/icons/delete-tr.svg";

interface DayHeaderProps {
  day: string;
  date: number;
  onEditAvailability: () => void;
  onClearDay: () => void;
}
const menuItemHoverStyle = {
  "&:hover": {
    filter: "sepia(100%) hue-rotate(190deg) saturate(500%)",
  },
  gap: 1,
};
export function DayHeader({
  day,
  date,
  onEditAvailability,
  onClearDay,
}: DayHeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = (action: () => void) => {
    action();
    handleClose();
  };
  return (
    <Box
      display={"flex"}
      alignItems={"start"}
      justifyContent={"space-between"}
      p={1}
    >
      <div>
        <Typography variant="bodyMediumExtraBold" sx={{ color: "grey.600" }}>
          {day}
        </Typography>
        <Typography variant="bodyMediumExtraBold" color="grey.500">
          {date}
        </Typography>
      </div>
      {/* <Button
        id="day-menu-button"
        aria-controls={open ? "day-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ p: 0 }}
      > */}
      <Box
        id="day-menu-button"
        aria-controls={open ? "day-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        component="img"
        sx={{
          p: 0,
          cursor: "pointer",
          filter: open
            ? "sepia(100%) hue-rotate(190deg) saturate(500%)"
            : "blue",
        }}
        alt="More."
        src={MoreVertIcon}
        onClick={handleClick}
      />

      {/* </Button> */}
      <Menu
        id="day-menu"
        anchorEl={anchorEl}
        open={open}
        sx={{
          "& .MuiPaper-root": {
            backdropFilter: "blur(12px)",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            border: "1px solid #358FF7",
            p: 0,
            boxShadow: "0px 5px 10px 0px #0000001A",
            borderRadius: "16px",
          },
        }}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "day-menu-button",
        }}
        
      >
        <MenuItem
          onClick={() => handleMenuItemClick(onEditAvailability)}
          sx={menuItemHoverStyle}
        >
          <Box component="img" alt="edit." src={edit} />
          <Typography variant="bodySmallSemiBold" color="grey.600">
            Edit Availability
          </Typography>
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick(onClearDay)}
          sx={menuItemHoverStyle}
        >
          <Box component="img" alt="delete." src={deleteIcn} />
          <Typography variant="bodySmallSemiBold" color="grey.600">
            Clear Day
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
