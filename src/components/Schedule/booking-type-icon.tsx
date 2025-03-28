import { Box, SxProps } from "@mui/material";
import { availabilityIcons } from "../../utils/Icons";
import { EnBookingType } from "../../utils/enums";

interface BookingTypeIconProps {
  bookingType: keyof typeof availabilityIcons | "";
  sx?: SxProps;
}

export const BookingTypeIcon = ({ bookingType, sx }: BookingTypeIconProps) => {
  let icon;

  switch (bookingType) {
    case EnBookingType.PHONE:
      icon = availabilityIcons.phone;
      break;
    case EnBookingType.IN_PERSON:
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
