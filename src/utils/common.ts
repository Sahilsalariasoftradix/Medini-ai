import dayjs from "dayjs";
import { EnBookings, EnCancelAppointment } from "./enums";
import { overRideSvgColor } from "./filters";
import { z } from "zod";

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
    lg: "600px",
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
    case "addappointment":
      return EnBookings.AddAppointment;
    case "clearappointment":
      return EnBookings.ClearAppointment;
    default:
      return EnBookings.Available;
  }
};
export const formatTimeSlot = (slot: any) => {
  if (!slot || !slot.from || !slot.to) return "Unavailable";

  const formatTime = (time: string) => {
    // Convert only if time is in HH:mm:ss format
    return time.match(/^\d{2}:\d{2}:\d{2}$/) ? time.slice(0, -3) : time;
  };

  return `${formatTime(slot.from)} - ${formatTime(slot.to)}`;
};
export const isPastDateTime = (date: Date, time: string) => {
  return (
    dayjs(date).isBefore(dayjs(), "day") &&
    dayjs(`${dayjs(date).format("YYYY-MM-DD")} ${time}`).isBefore(dayjs())
  );
};
export const formatType = (type: string) => {
  return type
    .replace(/_/g, " ") // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};

export const displayDays = ["", "M", "T", "W", "T", "F", "S", "S"];
export const dayDataMapping = ["MO", "TU", "WE", "TH", "FR", "SA", "SU"];
export const getDaysData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Update the day mapping to use unique keys
export const dayMapping: { [key: string]: string } = {
  MO: "MON",
  TU: "TUE",
  WE: "WED",
  TH: "THU",
  FR: "FRI",
  SA: "SAT",
  SU: "SUN",
};

// Function to map availabilities array to weeklyAvailability structure
export const mapAvailabilitiesToWeekly = (
  availabilities: any[],
  dayMapping: any
) => {
  const weeklyAvailability: any = {};

  availabilities.forEach((availability) => {
    const dayName = dayjs(availability.date).format("dddd").toLowerCase(); // Convert date to weekday
    if (!dayMapping[dayName]) return; // Skip if mapping is not available

    weeklyAvailability[dayMapping[dayName]] = {
      phone:
        availability.phone_start_time && availability.phone_end_time
          ? {
              from: availability.phone_start_time,
              to: availability.phone_end_time,
            }
          : null,
      in_person:
        availability.in_person_start_time && availability.in_person_end_time
          ? {
              from: availability.in_person_start_time,
              to: availability.in_person_end_time,
            }
          : null,
      break:
        availability.break_start_time && availability.break_end_time
          ? {
              from: availability.break_start_time,
              to: availability.break_end_time,
            }
          : null, // No break data available
    };
  });

  return weeklyAvailability;
};

export function formatPhoneNumber(number: string) {
  // Remove all non-numeric characters
  const cleaned = number.replace(/\D/g, "");

  // Ensure it has the correct length (11 digits for US numbers)
  if (cleaned.length === 11) {
    return `+1 (${cleaned.slice(0, 3).split("1").join("")}) ${cleaned.slice(
      3,
      6
    )}-${cleaned.slice(6)}`;
  } else {
    return "Invalid number";
  }
}

export const menuItemHoverStyle = {
  "&:hover": {
    filter: overRideSvgColor.blue,
  },
  gap: 1,
};

export const appointmentSchema = z.object({
  reason: z.enum(Object.values(EnCancelAppointment) as [string, ...string[]]),
});

export const availabilitySchema = z.object({
  isAvailable: z.boolean(),
  phone: z.object({
    from: z.string(),
    to: z.string(),
  }),
  in_person: z.object({
    from: z.string(),
    to: z.string(),
  }),

  break: z
    .object({
      from: z.string(),
      to: z.string(),
    })
    .optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export type AvailabilityFormData = z.infer<typeof availabilitySchema>;
export function formatDays(dayCodes:string[]) {
  const dayMap = {
      MO: "Monday",
      TU: "Tuesday",
      WE: "Wednesday",
      TH: "Thursday",
      FR: "Friday",
      SA: "Saturday",
      SU: "Sunday"
  };

  return dayCodes.map((code) => dayMap[code as keyof typeof dayMap] || code);
}
