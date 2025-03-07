import dayjs from "dayjs";
import { EnBookings } from "./enums";

// Function to get pathname for page
export const getPageNameFromPath = (path: string) => {
  const pathSegment = path.split("/")[1] || "Dashboard";
  return pathSegment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};
// Function for max form heights
export const getMaxHeight = () => ({
  maxHeight: {
    xs: "calc(100vh - 200px)",
    lg: "580px",
    xl: "100%",
  },
});
export const mapApiStatusToEnum = (status: string): EnBookings => {
  switch (status.toLowerCase()) {
    case "active":
      return EnBookings.Active;
    case "cancelled":
      return EnBookings.Cancel;
    case "unconfirmed":
      return EnBookings.Unconfirmed;
    default:
      return EnBookings.Available;
  }
};

export const isPastDateTime = (date: Date, time: string) => {
  return (
    dayjs(date).isBefore(dayjs(), "day") &&
    dayjs(`${dayjs(date).format("YYYY-MM-DD")} ${time}`).isBefore(dayjs())
  );
};
