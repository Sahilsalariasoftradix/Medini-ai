import { Box, SxProps } from "@mui/material";
import { availabilityIcons } from "../../utils/Icons";

interface BookingTypeIconProps {
  bookingType: keyof typeof availabilityIcons | "";
  sx?: SxProps;
}

export const BookingTypeIcon = ({ bookingType, sx }: BookingTypeIconProps) => {
  let icon;

  switch (bookingType) {
    case "phone":
      icon = availabilityIcons.phone;
      break;
    case "in_person":
      icon = availabilityIcons.in_person;
      break;
    case "break":
      icon = availabilityIcons.break;
      break;
    default:
      icon = "";
  }

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      sx={{
        width: "24px",
        height: "24px",
        ...sx,
      }}
    >
      {icon && <img height={"12px"} width={"12px"} src={icon} alt={icon} />}
    </Box>
  );
};
