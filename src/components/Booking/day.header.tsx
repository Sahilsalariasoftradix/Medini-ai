import { Box, Button, Menu, MenuItem, Typography } from "@mui/material";
import { useState } from "react";
import MoreVertIcon from "../../assets/icons/dots-vertical.svg";


interface DayHeaderProps {
  day: string;
  date: number;
  onEditAvailability: () => void;
  onClearDay: () => void;
}

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

  return (
    <Box
      display={"flex"}
      alignItems={"start"}
      justifyContent={"space-between"}
      p={1}
    >
      <div>
        <Typography variant="bodyMediumExtraBold" sx={{color:'grey.600'}}>{day}</Typography>
        <Typography variant="bodyMediumExtraBold" color="grey.500">{date}</Typography>
      </div>
      <Button
        id="day-menu-button"
        aria-controls={open ? "day-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ p: 0 }}
      >
        <img src={MoreVertIcon} alt="" />
      </Button>
      <Menu
        id="day-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "day-menu-button",
        }}
      >
        <MenuItem onClick={() => { onEditAvailability(); handleClose(); }}>
          Edit Availability
        </MenuItem>
        <MenuItem onClick={() => { onClearDay(); handleClose(); }}>
          Clear Day
        </MenuItem>
      </Menu>
    </Box>
  );
}
