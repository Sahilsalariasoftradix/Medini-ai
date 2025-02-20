import { availabilityIcons } from "../Icons";
import { IScheduleType } from "../Interfaces";

export const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  export const typeMappings: Record<"phone" | "in_person" | "break", IScheduleType> = {
    phone: { icon: availabilityIcons.phone, bgColor: "#edf2f7" }, // Light blue
    in_person: { icon: availabilityIcons.in_person, bgColor: "#e8f5ff" }, // Light green
    break: { icon: availabilityIcons.break, bgColor: "#dff1e6" }, // Light red/pink
  };
  export const headers = ["M", "T", "W", "T", "F", "S", "S"];


