import { Box, Typography } from "@mui/material";
import StepFormLayout from "../StepFormLayout";
import CommonButton from "../../common/CommonButton";
import { useStepForm } from "../../../store/StepFormContext";
import { useAuthHook } from "../../../hooks/useAuth";
import {
  getCurrentUserId,
  updateUserDetailsInFirestore,
} from "../../../firebase/AuthService";
import {
  errorSavingUserDetailsMessage,
  userNotSignedInErrorMessage,
} from "../../../utils/errorHandler";
import { EnOnboardingStatus } from "../../../utils/enums";
import { routes } from "../../../utils/links";
import { useAuth } from "../../../store/AuthContext";
import { useState } from "react";

import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { postAvailabilityGeneral } from "../../../api/userApi";
import CommonSnackbar from "../../common/CommonSnackbar";
import { useForm } from "react-hook-form";

import { AvailabilityFormData, formatType } from "../../../utils/common";
import SetAvailabilityForm from "./SetAvailabilityForm";
import { IDayAvailability, ITimeSlot } from "../../../utils/Interfaces";

dayjs.extend(isBetween);

// Add this helper function to check time overlaps
const checkTimeOverlap = (
  timeRange1: { from: string; to: string },
  timeRange2: { from: string; to: string }
): boolean => {
  if (
    !timeRange1.from ||
    !timeRange1.to ||
    !timeRange2.from ||
    !timeRange2.to
  ) {
    return false;
  }

  const start1 = dayjs(timeRange1.from, "HH:mm");
  const end1 = dayjs(timeRange1.to, "HH:mm");
  const start2 = dayjs(timeRange2.from, "HH:mm");
  const end2 = dayjs(timeRange2.to, "HH:mm");

  return (
    start1.isSame(start2) ||
    start1.isBetween(start2, end2) ||
    end1.isBetween(start2, end2) ||
    start2.isSame(start1) ||
    start2.isBetween(start1, end1) ||
    end2.isBetween(start1, end1)
  );
};

const ProceedAvailability = () => {
  // Hooks
  const { navigate, isLoading, setIsLoading } = useAuthHook();
  const { userDetails, setUserDetails } = useAuth();
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  //@ts-ignore
  const [loading, setLoading] = useState<boolean>(false);
  const [repeat, setRepeat] = useState(true);
  const [available, setAvailable] = useState(true);
  // Add this state to track checked days
  const [checkedDays, setCheckedDays] = useState<string[]>([]);
  const { resetForm } = useStepForm();
  const availabilityForm = useForm<AvailabilityFormData>({
    // resolver: zodResolver(availabilitySchema),
    defaultValues: {
      isAvailable: false,
      phone: { from: "", to: "" },
      in_person: { from: "", to: "" },
      break: { from: "", to: "" },
    },
  });

  const [onboardingStatus, setNewOnboardingStatus] = useState(
    userDetails?.onboardingStatus
  );
  console.log(onboardingStatus);
  // Error UI management
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "error",
  });

  // Update the weeklyAvailability state with unique keys
  const [weeklyAvailability, setWeeklyAvailability] = useState<{
    [key: string]: IDayAvailability;
  }>({
    MON: {
      date: "",
      phone_start_time: "",
      phone_end_time: "",
      in_person_start_time: "",
      in_person_end_time: "",
      break_start_time: "",
      break_end_time: "",
    },
    TUE: {
      date: "",
      phone_start_time: "",
      phone_end_time: "",
      in_person_start_time: "",
      in_person_end_time: "",
      break_start_time: "",
      break_end_time: "",
    },
    WED: {
      date: "",
      phone_start_time: "",
      phone_end_time: "",
      in_person_start_time: "",
      in_person_end_time: "",
      break_start_time: "",
      break_end_time: "",
    },
    THU: {
      date: "",
      phone_start_time: "",
      phone_end_time: "",
      in_person_start_time: "",
      in_person_end_time: "",
      break_start_time: "",
      break_end_time: "",
    },
    FRI: {
      date: "",
      phone_start_time: "",
      phone_end_time: "",
      in_person_start_time: "",
      in_person_end_time: "",
      break_start_time: "",
      break_end_time: "",
    },
    SAT: {
      date: "",
      phone_start_time: "",
      phone_end_time: "",
      in_person_start_time: "",
      in_person_end_time: "",
      break_start_time: "",
      break_end_time: "",
    },
    SUN: {
      date: "",
      phone_start_time: "",
      phone_end_time: "",
      in_person_start_time: "",
      in_person_end_time: "",
      break_start_time: "",
      break_end_time: "",
    },
  });
  console.log(weeklyAvailability);
  // Add this state to track which day was clicked
  const [selectedDay, setSelectedDay] = useState<string>("");

  // Update the day mapping to use unique keys
  const dayMapping: { [key: string]: string } = {
    MO: "MON",
    TU: "TUE",
    WE: "WED",
    TH: "THU",
    FR: "FRI",
    SA: "SAT",
    SU: "SUN",
  };

  // Closing snackbar
  const handleSnackbarClose = () => {
    setSnackbar((prevSnackbar) => ({
      ...prevSnackbar,
      open: false,
    }));
  };

  // Final data submission and status changing function
  const handleContinue = async () => {
    setIsLoading(true);
    try {
      // Create a mapping for three-letter days to full day names
      const dayFullNames: { [key: string]: string } = {
        MON: "monday",
        TUE: "tuesday",
        WED: "wednesday",
        THU: "thursday",
        FRI: "friday",
        SAT: "saturday",
        SUN: "sunday",
      };

      // Filter and transform the availability data
      const availabilities = Object.entries(weeklyAvailability)
        .filter(([key, value]) => {
          // Only include three-letter day codes that have data
          return (
            key.length === 3 && // Check for MON, TUE, etc.
            Object.keys(value).length > 0 && // Has some data
            value.phone &&
            value.in_person
          ); // Has required fields
        })
        .map(([day, slots]) => ({
          day_of_week: dayFullNames[day],
          phone_start_time: slots.phone?.from ? `${slots.phone.from}:00` : null,
          phone_end_time: slots.phone?.to ? `${slots.phone.to}:00` : null,
          in_person_start_time: slots.in_person?.from
            ? `${slots.in_person.from}:00`
            : null,
          in_person_end_time: slots.in_person?.to
            ? `${slots.in_person.to}:00`
            : null,
          break_start_time: slots.break?.from ? `${slots.break.from}:00` : null,
          break_end_time: slots.break?.to ? `${slots.break.to}:00` : null,
        }));

      if (
        availabilities.length === 0 ||
        !availabilities.some(
          (availability) =>
            (availability.phone_start_time && availability.phone_end_time) ||
            (availability.in_person_start_time &&
              availability.in_person_end_time)
        )
      ) {
        setSnackbar({
          open: true,
          message: "Please set availability for at least one day",
          severity: "error",
        });
        setIsLoading(false);
        return;
      }

      // Step 1: Get the current user ID
      const userId = getCurrentUserId();
      if (!userId) {
        setIsLoading(false);
        throw new Error(userNotSignedInErrorMessage);
      }

      const updatedStatus = EnOnboardingStatus.STATUS_2; // Store the new value

      setNewOnboardingStatus(updatedStatus); // Update state
      // Step 2: Update Firestore with the new status
      await updateUserDetailsInFirestore(userId, {
        onboardingStatus: updatedStatus, // Use updatedStatus directly
        confirmAppointments: {
          isConfirmed: false,
          days: 2,
        },
      });
      setUserDetails({
        ...userDetails,
        onboardingStatus: updatedStatus,
        confirmAppointments: {
          isConfirmed: false,
          days: 2,
        },
      });
      resetForm();
      // Create the final payload
      const payload = {
        user_id: userDetails?.user_id, // Replace with actual user ID if needed
        availabilities,
      };

      // Log the payload to verify the structure
      // console.log("Sending payload:", payload);

      await postAvailabilityGeneral(payload);

      setSnackbar({
        open: true,
        message: "Availability saved successfully",
        severity: "success",
      });

      setTimeout(() => {
        navigate(routes.sidebar.bookings.link);
      }, 2000);
    } catch (error) {
      console.error(errorSavingUserDetailsMessage, error);
      setSnackbar({
        open: true,
        message:
          error instanceof Error
            ? error.message
            : "Failed to save availability",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add this validation function
  const validateTimeSlots = (values: AvailabilityFormData): boolean => {
    // Check if at least one of phone or in_person is filled
    const hasPhone = values.phone.from && values.phone.to;
    const hasInPerson = values.in_person.from && values.in_person.to;

    if (!hasPhone && !hasInPerson) {
      setSnackbar({
        open: true,
        message: "Either Phone or In Person availability must be set",
        severity: "error",
      });
      return false;
    }

    const timeSlots = [
      ...(hasPhone ? [{ type: "phone", times: values.phone }] : []),
      ...(hasInPerson ? [{ type: "in_person", times: values.in_person }] : []),
      // ...(values.break.from && values.break.to
      //   ? [{ type: "break", times: values.break }]
      //   : []),
    ];

    // Check if end time is after start time for each slot
    for (const slot of timeSlots) {
      if (slot.times.from && slot.times.to) {
        const start = dayjs(slot.times.from, "HH:mm");
        const end = dayjs(slot.times.to, "HH:mm");

        if (end.isBefore(start)) {
          setSnackbar({
            open: true,
            message: `${
              slot.type.charAt(0).toUpperCase() + slot.type.slice(1)
            } end time cannot be earlier than start time.`,
            severity: "error",
          });
          return false;
        }
      }
    }

    // Check for overlaps between different types of slots
    for (let i = 0; i < timeSlots.length; i++) {
      for (let j = i + 1; j < timeSlots.length; j++) {
        //@ts-ignore
        if (checkTimeOverlap(timeSlots[i].times, timeSlots[j].times)) {
          setSnackbar({
            open: true,
            message: `Time slots for ${formatType(
              timeSlots[i].type
            )} and ${formatType(timeSlots[j].type)} cannot overlap.`,
            severity: "error",
          });
          return false;
        }
      }
    }

    return true;
  };

  // Update handleAvailabilitySubmit to include validation
  const handleAvailabilitySubmit = () => {
    const values = availabilityForm.getValues();

    // Only validate time slots if marking as available
    if (available && !validateTimeSlots(values)) {
      return;
    }

    const selectedDays = repeat
      ? checkedDays.map((day) => dayMapping[day])
      : [dayMapping[selectedDay]];

    selectedDays.forEach((day) => {
      //@ts-ignore
      setWeeklyAvailability((prev) => ({
        ...prev,
        [day]: available
          ? {
              phone: values.phone,
              in_person: values.in_person,
              break: values.break,
            }
          : {
              phone: { from: "", to: "" },
              in_person: { from: "", to: "" },
              break: { from: "", to: "" },
            },
      }));
    });

    setIsAvailabilityModalOpen(false);
  };

  // Add this function to format time slots for display
  const formatTimeSlot = (slot?: ITimeSlot) => {
    if (!slot || !slot.from || !slot.to) return "Unavailable";
    return `${slot.from} - ${slot.to}`;
  };

  // Update handleDayClick to set the initial checked day
  const handleDayClick = (day: string) => {
    const dayData = weeklyAvailability[dayMapping[day]];

    // Reset form with existing values for the selected day
    availabilityForm.reset({
      isAvailable: true,
      phone: dayData?.phone || { from: "", to: "" },
      in_person: dayData?.in_person || { from: "", to: "" },
      break: dayData?.break || { from: "", to: "" },
    });

    setSelectedDay(day);
    setCheckedDays([day]); // Set the clicked day as checked
    setIsAvailabilityModalOpen(true);
  };

  // Add handler for checkbox changes
  const handleCheckboxChange = (day: string) => {
    setCheckedDays((prev) => {
      if (prev.includes(day)) {
        return prev.filter((d) => d !== day);
      }
      return [...prev, day];
    });
  };

  return (
    <StepFormLayout>
      <Typography
        align="center"
        variant="h3"
        sx={{ fontSize: { xs: 24, md: 28 } }}
      >
        Set your availability
      </Typography>
      <Typography
        align="center"
        variant="bodyLargeRegular"
        sx={{ my: 1 }}
        color="grey.600"
      >
        Before we get started, let us know your work hours and if bookings
        should be in person or by phone in Availability.
      </Typography>

      <SetAvailabilityForm
        availabilityForm={availabilityForm}
        handleAvailabilitySubmit={handleAvailabilitySubmit}
        available={available}
        setAvailable={setAvailable}
        repeat={repeat}
        setRepeat={setRepeat}
        checkedDays={checkedDays}
        handleCheckboxChange={handleCheckboxChange}
        handleDayClick={handleDayClick}
        formatTimeSlot={formatTimeSlot}
        weeklyAvailability={weeklyAvailability}
        dayMapping={dayMapping}
        isAvailabilityModalOpen={isAvailabilityModalOpen}
        setIsAvailabilityModalOpen={setIsAvailabilityModalOpen}
        loading={loading}
        snackbar={snackbar}
        handleSnackbarClose={handleSnackbarClose}
      />
      <form>
        <Box mt={0}>
          <Box justifyContent={"center"} display={"flex"}>
            <CommonButton
              sx={{ p: 1.5, mt: 2, width: "60%" }}
              text={"Continue"}
              loading={isLoading}
              onClick={handleContinue}
              fullWidth
              type="button"
            />
          </Box>
        </Box>
      </form>
      {/* Snackbar */}
      <CommonSnackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </StepFormLayout>
  );
};

export default ProceedAvailability;
