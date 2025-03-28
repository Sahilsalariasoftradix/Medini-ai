import { EnBookings } from "../../utils/enums";
import available from "../../assets/icons/available.svg";
import cancel from "../../assets/icons/cancelled.svg";
import active from "../../assets/icons/active.svg";
import unconfirmed from "../../assets/icons/unconfirmed.svg";
import edit from "../../assets/icons/edit-table.svg";
import deleteIcn from "../../assets/icons/delete-tr.svg";
import { Box, SxProps } from "@mui/material";

interface StatusIconProps {
  status: EnBookings;
  handleClick?: (event: React.MouseEvent<HTMLElement>) => void;
  sx?: SxProps;
}

export const StatusIcon = ({ status, handleClick, sx }: StatusIconProps) => {
  let icon;

  switch (status) {
    case EnBookings.Available:
      icon = available;
      break;
    case EnBookings.Active:
      icon = active;
      break;
    case EnBookings.Cancel:
      icon = cancel;
      break;
    case EnBookings.Unconfirmed:
      icon = unconfirmed;
      break;
    case EnBookings.Edit:
      icon = edit;
      break;
    case EnBookings.AddAppointment:
      icon = available;
      break;
    case EnBookings.ClearAppointment:
      icon = deleteIcn;
      break;
    default:
      icon = available;
  }

  return (
    <Box
      onClick={handleClick}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        width: "24px",
        height: "24px",
        ...sx,
      }}
    >
      <img src={icon} alt={icon} />
    </Box>
  );
};
