import dayjs from "dayjs";
import { EnBookings, EnCallPurposeOptions, EnCallPurposeOptionsValues, EnCancelAppointment } from "./enums";
import { overRideSvgColor } from "./filters";
import { z } from "zod";
import { Data, HeadCell } from "./Interfaces";

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
export const callPurposeOptions = [

  {
    label: EnCallPurposeOptions.REQUESTINFO,
    value: EnCallPurposeOptionsValues.REQUESTINFO,
  },
  { label: EnCallPurposeOptions.BOOK, value: EnCallPurposeOptionsValues.BOOK },
  {
    label: EnCallPurposeOptions.CANCEL,
    value: EnCallPurposeOptionsValues.CANCEL,
  },
  {
    label: EnCallPurposeOptions.RESCHEDULE,
    value: EnCallPurposeOptionsValues.RESCHEDULE,
  },
  {
    label: EnCallPurposeOptions.INFORMPATIENT,
    value: EnCallPurposeOptionsValues.INFORMPATIENT,
  },
];
export const rows = [
  createData(
    1,
    "Wiltz, K",
    "Patient123219",
    "January 05, 2025",
    "Cancel",
    "30 min",
    "Please give patient a pharmac...",
    "Follow-up"
  ),
  createData(
    2,
    "Johnson, P",
    "Patient123219",
    "January 02, 2025",
    "Book",
    "15 min",
    "Broken ickle sorcerer",
    "Follow-up"
  ),
  createData(
    3,
    "Hussein, M",
    "Patient123219",
    "January 01, 2025",
    "Reschedule",
    "45 min",
    "Biting vulture-hat mewing phials with",
    "Follow-up"
  ),
  createData(
    4,
    "Gonzalez, L",
    "Patient123220",
    "January 06, 2025",
    "Book",
    "30 min",
    "Chronic back pain issues",
    "Follow-up"
  ),
  createData(
    5,
    "Smith, J",
    "Patient123221",
    "January 07, 2025",
    "Cancel",
    "25 min",
    "Heartburn and indigestion",
    "Follow-up"
  ),
  createData(
    6,
    "Martinez, R",
    "Patient123222",
    "January 08, 2025",
    "Request Info",
    "40 min",
    "Migraine headache symptoms",
    "Follow-up"
  ),
  createData(
    7,
    "Lee, S",
    "Patient123223",
    "January 09, 2025",
    "Request Info",
    "20 min",
    "Anxiety and stress management",
    "Follow-up"
  ),
  createData(
    8,
    "Taylor, D",
    "Patient123224",
    "January 10, 2025",
    "Request Info",
    "15 min",
    "Allergic reaction to pollen",
    "Follow-up"
  ),
  createData(
    9,
    "Brown, C",
    "Patient123225",
    "January 11, 2025",
    "Request Info",
    "35 min",
    "Severe coughing fits",
    "Follow-up"
  ),
  createData(
    10,
    "Kim, H",
    "Patient123226",
    "January 12, 2025",
    "Book",
    "25 min",
    "Routine physical checkup",
    "Follow-up"
  ),
  createData(
    11,
    "Davis, N",
    "Patient123227",
    "January 13, 2025",
    "Cancel",
    "30 min",
    "Knee injury after sports",
    "Follow-up"
  ),
  createData(
    12,
    "White, A",
    "Patient123228",
    "January 14, 2025",
    "Reschedule",
    "40 min",
    "Skin rash and irritation",
    "Follow-up"
  ),
  createData(
    13,
    "Evans, M",
    "Patient123229",
    "January 15, 2025",
    "Book",
    "20 min",
    "Ear infection treatment",
    "Follow-up"
  ),
  createData(
    14,
    "Wilson, B",
    "Patient123230",
    "January 16, 2025",
    "Cancel",
    "30 min",
    "Blood pressure monitoring",
    "Follow-up"
  ),
  createData(
    15,
    "Moore, T",
    "Patient123231",
    "January 17, 2025",
    "Reschedule",
    "45 min",
    "Flu-like symptoms",
    "Follow-up"
  ),
  createData(
    16,
    "Taylor, J",
    "Patient123232",
    "January 18, 2025",
    "Book",
    "15 min",
    "Pregnancy test consultation",
    "Follow-up"
  ),
  createData(
    17,
    "Martin, C",
    "Patient123233",
    "January 19, 2025",
    "Cancel",
    "30 min",
    "Back pain after lifting heavy",
    "Follow-up"
  ),
  createData(
    18,
    "Hernandez, G",
    "Patient123234",
    "January 20, 2025",
    "Reschedule",
    "35 min",
    "Sore throat and cough",
    "Follow-up"
  ),
  createData(
    19,
    "Lee, K",
    "Patient123235",
    "January 21, 2025",
    "Book",
    "25 min",
    "Childhood vaccination",
    "Follow-up"
  ),
  createData(
    20,
    "King, W",
    "Patient123236",
    "January 22, 2025",
    "Cancel",
    "40 min",
    "Tiredness and fatigue",
    "Follow-up"
  ),
  createData(
    21,
    "Graham, R",
    "Patient123237",
    "January 23, 2025",
    "Reschedule",
    "15 min",
    "Chronic headache issues",
    "Follow-up"
  ),
  createData(
    22,
    "Green, J",
    "Patient123238",
    "January 24, 2025",
    "Book",
    "30 min",
    "Diabetes management",
    "Follow-up"
  ),
  createData(
    23,
    "Adams, F",
    "Patient123239",
    "January 25, 2025",
    "Cancel",
    "25 min",
    "Seasonal allergies",
    "Follow-up"
  ),
  createData(
    24,
    "Scott, V",
    "Patient123240",
    "January 26, 2025",
    "Reschedule",
    "35 min",
    "Chest pain and pressure",
    "Follow-up"
  ),
  createData(
    25,
    "Nelson, E",
    "Patient123241",
    "January 27, 2025",
    "Book",
    "20 min",
    "Sprained ankle recovery",
    "Follow-up"
  ),
  createData(
    26,
    "Carter, D",
    "Patient123242",
    "January 28, 2025",
    "Cancel",
    "15 min",
    "Abdominal cramps",
    "Follow-up"
  ),
  createData(
    27,
    "Morris, P",
    "Patient123243",
    "January 29, 2025",
    "Reschedule",
    "45 min",
    "Infection after surgery",
    "Follow-up"
  ),
  createData(
    28,
    "Baker, J",
    "Patient123244",
    "January 30, 2025",
    "Book",
    "40 min",
    "Routine physical exam",
    "Follow-up"
  ),
  createData(
    29,
    "Perez, A",
    "Patient123245",
    "February 01, 2025",
    "Cancel",
    "30 min",
    "Severe nausea",
    "Follow-up"
  ),
  createData(
    30,
    "Harris, T",
    "Patient123246",
    "February 02, 2025",
    "Reschedule",
    "25 min",
    "Urinary tract infection",
    "Follow-up"
  ),
  createData(
    31,
    "Martin, D",
    "Patient123247",
    "February 03, 2025",
    "Book",
    "20 min",
    "Headache and dizziness",
    "Follow-up"
  ),
  createData(
    32,
    "Clark, B",
    "Patient123248",
    "February 04, 2025",
    "Cancel",
    "35 min",
    "Earache and blocked ear",
    "Follow-up"
  ),
  createData(
    33,
    "Rodriguez, P",
    "Patient123249",
    "February 05, 2025",
    "Reschedule",
    "45 min",
    "Knee pain from injury",
    "Follow-up"
  ),
  createData(
    34,
    "Lewis, J",
    "Patient123250",
    "February 06, 2025",
    "Book",
    "30 min",
    "Cold and cough symptoms",
    "Follow-up"
  ),
  createData(
    35,
    "Young, T",
    "Patient123251",
    "February 07, 2025",
    "Cancel",
    "15 min",
    "Food poisoning",
    "Follow-up"
  ),
  createData(
    36,
    "Walker, K",
    "Patient123252",
    "February 08, 2025",
    "Reschedule",
    "40 min",
    "Numbness in hands",
    "Follow-up"
  ),
  createData(
    37,
    "Allen, R",
    "Patient123253",
    "February 09, 2025",
    "Book",
    "30 min",
    "Chronic fatigue syndrome",
    "Follow-up"
  ),
  createData(
    38,
    "Hill, F",
    "Patient123254",
    "February 10, 2025",
    "Cancel",
    "45 min",
    "Asthma flare-up",
    "Follow-up"
  ),
  createData(
    39,
    "Collins, S",
    "Patient123255",
    "February 11, 2025",
    "Reschedule",
    "25 min",
    "Sinus congestion",
    "Follow-up"
  ),
  createData(
    40,
    "Gonzalez, T",
    "Patient123256",
    "February 12, 2025",
    "Book",
    "20 min",
    "High cholesterol consultation",
    "Follow-up"
  ),
  createData(
    41,
    "Anderson, M",
    "Patient123257",
    "February 13, 2025",
    "Cancel",
    "35 min",
    "Stomach cramps",
    "Follow-up"
  ),
  createData(
    42,
    "Harris, K",
    "Patient123258",
    "February 14, 2025",
    "Reschedule",
    "40 min",
    "Muscle spasms in back",
    "Follow-up"
  ),
  createData(
    43,
    "Mitchell, E",
    "Patient123259",
    "February 15, 2025",
    "Book",
    "25 min",
    "Skin rash and blisters",
    "Follow-up"
  ),
  createData(
    44,
    "Perez, N",
    "Patient123260",
    "February 16, 2025",
    "Cancel",
    "30 min",
    "Severe abdominal pain",
    "Follow-up"
  ),
  createData(
    45,
    "Roberts, L",
    "Patient123261",
    "February 17, 2025",
    "Reschedule",
    "15 min",
    "Dizzy spells",
    "Follow-up"
  ),
  createData(
    46,
    "Jackson, F",
    "Patient123262",
    "February 18, 2025",
    "Book",
    "20 min",
    "Fever and chills",
    "Follow-up"
  ),
  createData(
    47,
    "Taylor, M",
    "Patient123263",
    "February 19, 2025",
    "Cancel",
    "25 min",
    "Cold and cough",
    "Follow-up"
  ),
  createData(
    48,
    "Lopez, R",
    "Patient123264",
    "February 20, 2025",
    "Reschedule",
    "35 min",
    "Severe headaches",
    "Follow-up"
  ),
  createData(
    49,
    "King, L",
    "Patient123265",
    "February 21, 2025",
    "Book",
    "40 min",
    "Blood sugar regulation",
    "Follow-up"
  ),
  createData(
    50,
    "Nguyen, P",
    "Patient123266",
    "February 22, 2025",
    "Cancel",
    "30 min",
    "Upper back pain",
    "Follow-up"
  ),
];
function createData(
  id: number,
  contact: string,
  patientId: string,
  date: string,
  status: Data["status"],
  length: string,
  details: string,
  callPurpose: string
): Data {
  return {
    id,
    contact,
    patientId,
    date,
    status,
    length,
    details,
    callPurpose,
  };
}
export const headCells: readonly HeadCell[] = [
  {
    id: "contact",
    numeric: false,
    disablePadding: true,
    label: "Contact",
    sortable: true, // Add this property
  },
  {
    id: "date",
    numeric: false,
    disablePadding: false,
    label: "Date",
    sortable: true, // Add this property
  },
  {
    id: "status",
    numeric: false,
    disablePadding: false,
    label: "Call Purpose",
    sortable: true, // Add this property
  },
  {
    id: "length",
    numeric: false,
    disablePadding: false,
    label: "Length",
    sortable: true, // Add this property
  },
  {
    id: "details",
    numeric: false,
    disablePadding: false,
    label: "Details",
    sortable: true, // Add this property
  },
  {
    id: "actions" as keyof Data,
    numeric: false,
    disablePadding: false,
    label: "Actions",
    sortable: false, // Add this property
  },
];