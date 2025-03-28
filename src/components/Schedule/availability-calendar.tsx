import {
  Box,
  Paper,
  IconButton,
  Typography,
  Popover,
  Tooltip,
  CircularProgress,
  Menu,
  MenuItem,
  Divider,
  AlertProps,
} from "@mui/material";
import { DayHeader } from "./day-header";
// import edit from "../../assets/icons/edit-table.svg";
import Grid from "@mui/material/Grid2";
import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import calendarIcon from "../../assets/icons/calenderIcon.svg";
import leftArrow from "../../assets/icons/left.svg";
import rightArrow from "../../assets/icons/right.svg";
import { EnAvailability, EnBookings, EnBookingType } from "../../utils/enums";
import { useAvailability } from "../../store/AvailabilityContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IBookingResponse } from "../../utils/Interfaces";
import {
  cancelBooking,
  getBookings,
  updateBooking,
  postAvailabilityGeneral,
  clearBooking,
} from "../../api/userApi";
import { BookingTypeIcon } from "./booking-type-icon";
// import { otherIcons } from "../../utils/Icons";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CommonDialog from "../common/CommonDialog";
import SlotBookingForm from "../Booking/Form/SlotBookingForm";
// import { EnBookings } from "../../utils/enums";
import { createBooking } from "../../api/userApi";
import {
  CancelFormData,
  CANCELLATION_REASONS,
  cancelSchema,
} from "../Booking/availability-calendar";
import CommonTextField from "../common/CommonTextField";
import CommonSnackbar from "../common/CommonSnackbar";
import { StatusIcon } from "../Booking/status-icon";
import {
  formatTimeSlot,
  isPastDateTime,
  mapAvailabilitiesToWeekly,
  // menuItemHoverStyle,
} from "../../utils/common";
import SetAvailabilityForm from "../StepForm/Components/SetAvailabilityForm";
import CommonButton from "../common/CommonButton";
import { useAuth } from "../../store/AuthContext";
import ConfirmAppointments from "./Form/ConfirmAppointments";
import { DaySchedule } from "../../types/calendar";

dayjs.extend(isSameOrBefore);

const appointmentSchema = z.object({
  contact: z.object({
    title: z.string(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    phone: z.string(),
  }),
  date: z.any(),
  startTime: z.string(),
  length: z.string().min(1, "Appointment length is required"),
  booking_type: z.enum([EnBookingType.IN_PERSON, EnBookingType.PHONE], {
    errorMap: () => ({ message: "Please select an appointment type" }),
  }),
  reasonForCall: z.string().min(1, "Reason for appointment is required"),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

// Add this near the top of the file, with other constant declarations
const dayMapping: { [key: string]: string } = {
  MO: "monday",
  TU: "tuesday",
  WE: "wednesday",
  TH: "thursday",
  FR: "friday",
  SA: "saturday",
  SU: "sunday",
};

// Add this helper function near the top of the file
const checkAvailabilityOverlap = (
  phone: { from: string; to: string },
  inPerson: { from: string; to: string }
) => {
  const phoneStart = dayjs(`2024-01-01 ${phone.from}`);
  const phoneEnd = dayjs(`2024-01-01 ${phone.to}`);
  const inPersonStart = dayjs(`2024-01-01 ${inPerson.from}`);
  const inPersonEnd = dayjs(`2024-01-01 ${inPerson.to}`);

  // Check if phone and in-person times overlap
  const phoneOverlapsInPerson =
    phoneStart.isValid() &&
    inPersonStart.isValid() &&
    (phoneStart.isBetween(inPersonStart, inPersonEnd) ||
      phoneEnd.isBetween(inPersonStart, inPersonEnd) ||
      inPersonStart.isBetween(phoneStart, phoneEnd) ||
      inPersonEnd.isBetween(phoneStart, phoneEnd));

  return {
    hasOverlap: phoneOverlapsInPerson,
    message: phoneOverlapsInPerson
      ? "Phone and In Person availability times overlap"
      : "",
  };
};

export default function AvailabilityCalendar() {
  const {
    days,
    dateRange,
    setDateRange,
    generateDaysFromRange,
    handleNextWeek,
    handlePreviousWeek,
    fetchInitialAvailability,
    availabilities,
  } = useAvailability();
  const [startDate, endDate] = dateRange;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  // const [anchorEl1, setAnchorEl1] = useState<null | HTMLElement>(null);
  // const open = Boolean(anchorEl1);
  const [bookings, setBookings] = useState<IBookingResponse[]>([]);
  const [today, setToday] = useState(dayjs());
  const [changed, setChanged] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openContactSearch, setOpenContactSearch] = useState(false);
  const [options] = useState<readonly any[]>([]);
  const [loadingClearAppointment, setLoadingClearAppointment] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as AlertProps["severity"],
  });
  const [appointmentStatus, setAppointmentStatus] = useState<string | null>(
    null
  );
  // const handleClose = () => {
  //   setAnchorEl1(null);
  // };

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });
  const {
    control: cancelControl,
    handleSubmit: handleCancelSubmit,
    formState: { errors: cancelErrors },
    reset: resetCancel,
  } = useForm<CancelFormData>({
    resolver: zodResolver(cancelSchema),
    defaultValues: {
      reasonForCancelling: "Schedule Conflict",
    },
  });

  // Add these new states for availability form
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [available, setAvailable] = useState(true);
  const [openEditAvailability, setOpenEditAvailability] = useState(true);
  const [repeat, setRepeat] = useState(false);
  const [checkedDays, setCheckedDays] = useState<string[]>([]);
  const [clearAppointment, setClearAppointment] = useState(false);
  const [valuesChanged, setValuesChanged] = useState(false);
  const [weeklyAvailability, setWeeklyAvailability] = useState<any>({});
  const [transformedWeeklyAvailability, setTransformedWeeklyAvailability] =
    useState(
      mapAvailabilitiesToWeekly(availabilities, {
        monday: "monday",
        tuesday: "tuesday",
        wednesday: "wednesday",
        thursday: "thursday",
        friday: "friday",
        saturday: "saturday",
        sunday: "sunday",
      })
    );
  const { userDetails } = useAuth();
  // Add this useEffect to update transformedWeeklyAvailability when availabilities changes
  useEffect(() => {
    setTransformedWeeklyAvailability(
      mapAvailabilitiesToWeekly(availabilities, {
        monday: "monday",
        tuesday: "tuesday",
        wednesday: "wednesday",
        thursday: "thursday",
        friday: "friday",
        saturday: "saturday",
        sunday: "sunday",
      })
    );
  }, [availabilities]);

  const availabilityForm = useForm({
    defaultValues: {
      phone: { from: "", to: "" },
      in_person: { from: "", to: "" },
      break: { from: "", to: "" },
    },
  });
  useEffect(() => {
    if (startDate && changed) {
      setToday(dayjs(startDate));
    }
  }, [startDate, changed]);

  useEffect(() => {
    fetchInitialAvailability();
  }, []);
  // Add this useEffect to reset form with new time and date

  useEffect(() => {
    if (startDate && endDate) {
      generateDaysFromRange(startDate, endDate);
      fetchBookings();
    }
  }, [startDate, endDate, today]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getBookings({
        user_id: userDetails?.user_id,
        date: dayjs(today).format("YYYY-MM-DD"),
        range: EnAvailability.DAY,
      });
      setBookings(response.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [today]);

  const getSlots = useCallback(() => {
    const day = days.find(
      (day) => day.fullDate === dayjs(today).format("YYYY-MM-DD")
    );

    // Get the base slots
    const baseSlots = day?.availability?.slots || [];

    // Calculate hour range from both available slots and bookings
    const hourRange = getAvailableHourRange([day!].filter(Boolean), bookings);

    // Determine availability times from the current day data
    const dayKey = dayjs(today).format("dddd").toLowerCase();

    const dayAvailability = transformedWeeklyAvailability[dayKey];

    // Get earliest availability time (from either phone or in-person)
    let earliestAvailabilityTime = null;
    if (dayAvailability) {
      const phoneStart = dayAvailability.phone && dayAvailability.phone.from;
      const inPersonStart =
        dayAvailability.in_person && dayAvailability.in_person.from;

      if (phoneStart && inPersonStart) {
        earliestAvailabilityTime = dayjs(`2024-01-01 ${phoneStart}`).isBefore(
          dayjs(`2024-01-01 ${inPersonStart}`)
        )
          ? phoneStart
          : inPersonStart;
      } else if (phoneStart) {
        earliestAvailabilityTime = phoneStart;
      } else if (inPersonStart) {
        earliestAvailabilityTime = inPersonStart;
      }
    }

    // If we have bookings but no slots, or need to expand the time range
    if (bookings.length > 0 || baseSlots.length === 0) {
      // Create a full range of slots from start to end hour
      const allSlots = [];
      for (let hour = hourRange.start; hour < hourRange.end; hour++) {
        for (let minute = 0; minute < 60; minute += 15) {
          const formattedHour = hour.toString().padStart(2, "0");
          const formattedMinute = minute.toString().padStart(2, "0");
          const time = `${formattedHour}:${formattedMinute}`;

          // Check if this slot already exists in baseSlots
          const existingSlot = baseSlots.find((slot) => slot.time === time);

          // Check if this time is before availability starts
          const isBeforeAvailability =
            earliestAvailabilityTime &&
            dayjs(`2024-01-01 ${time}`).isBefore(
              dayjs(`2024-01-01 ${earliestAvailabilityTime}`)
            );

          if (existingSlot) {
            allSlots.push({
              ...existingSlot,
              isDisabled: existingSlot.isDisabled || isBeforeAvailability,
            });
          } else {
            // Create a new slot
            allSlots.push({
              time,
              isDisabled: isBeforeAvailability || false,
            });
          }
        }
      }
      return allSlots;
    }

    return baseSlots;
  }, [days, today, bookings, transformedWeeklyAvailability]);

  const handleEditAvailability = (day: string) => {
    console.log(`Editing availability for ${day}`);
  };

  const handleClearDay = (day: string) => {
    console.log(`Clearing ${day}`);
  };

  const formatDateRange = () => {
    if (!startDate || !endDate) return "";
    return `${dayjs(startDate).format("MMM DD")} - ${dayjs(endDate).format(
      "MMM DD, YYYY"
    )}`;
  };
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const findBookingForTimeSlot = (time: string) => {
    return bookings.find((booking) => booking.start_time === `${time}:00`);
  };

  const onCancelSubmit = async () => {
    setLoading(true);
    try {
      if (!appointmentId) return;

      // Send cancel status to the API with dynamic booking ID
      const currentBooking = bookings.find(
        (booking) => booking.booking_id.toString() === appointmentId
      );
      if (currentBooking) {
        await cancelBooking(currentBooking.booking_id);
        fetchBookings();
      }

      setOpenCancelDialog(false);
      resetCancel();

      setSnackbar({
        open: true,
        message: "Appointment cancelled successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      setSnackbar({
        open: true,
        message: "Failed to cancel appointment",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: AppointmentFormData) => {
    setLoading(true);
    try {
      const startTimeFormatted = dayjs(data.startTime, "HH:mm");
      const endTimeFormatted = startTimeFormatted
        .add(Number(data.length), "minute")
        .format("HH:mm");
      if (isEditing && appointmentId) {
        await updateBooking({
          user_id: userDetails?.user_id,
          booking_id: Number(appointmentId),
          date: dayjs(data.date).format("YYYY-MM-DD"),
          start_time: data.startTime,
          end_time: dayjs(data.startTime, "HH:mm")
            .add(15, "minute")
            .format("HH:mm"),
          details: data.reasonForCall,
          first_name: data.contact.firstName,
          last_name: data.contact.lastName,
          email: data.contact.email,
          phone: data.contact.phone,
          booking_type: data.booking_type,
        });
      } else {
        await createBooking({
          user_id: userDetails?.user_id,
          date: dayjs(data.date).format("YYYY-MM-DD"),
          start_time: data.startTime,
          end_time: endTimeFormatted,
          details: data.reasonForCall,
          first_name: data.contact.firstName,
          last_name: data.contact.lastName,
          email: data.contact.email,
          phone: data.contact.phone,
          booking_type: data.booking_type,
        });
      }

      await fetchBookings();
      setOpenDialog(false);
      reset();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
      console.error("Failed to create appointment:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxChange = (day: string) => {
    setCheckedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleDayClick = (day: string) => {
    // Get the selected day's data from the most up-to-date availability
    const selectedDayData =
      transformedWeeklyAvailability[dayMapping[day]] ||
      //@ts-ignore
      weeklyAvailability[dayMapping[day]];

    // Reset form with the existing data - trim any ":00" seconds from time values
    availabilityForm.reset({
      phone: {
        from: selectedDayData?.phone?.from
          ? selectedDayData.phone.from.replace(/:00$/, "")
          : "",
        to: selectedDayData?.phone?.to
          ? selectedDayData.phone.to.replace(/:00$/, "")
          : "",
      },
      in_person: {
        from: selectedDayData?.in_person?.from
          ? selectedDayData.in_person.from.replace(/:00$/, "")
          : "",
        to: selectedDayData?.in_person?.to
          ? selectedDayData.in_person.to.replace(/:00$/, "")
          : "",
      },
      break: {
        from: selectedDayData?.break?.from
          ? selectedDayData.break.from.replace(/:00$/, "")
          : "",
        to: selectedDayData?.break?.to
          ? selectedDayData.break.to.replace(/:00$/, "")
          : "",
      },
    });

    // Set available state based on whether there's any data
    setAvailable(!!selectedDayData);

    // Add the day to checkedDays if not already present
    if (!checkedDays.includes(day)) {
      setCheckedDays([day]); // Change this to only include the clicked day
    }

    setIsAvailabilityModalOpen(true);
  };
  const getAvailableHourRange = (
    days: DaySchedule[],
    bookings: IBookingResponse[] = []
  ) => {
    let earliestHour = 24;
    let latestHour = 0;

    // Check availability slots
    days.forEach((day) => {
      if (day.availability.slots.length > 0) {
        // Get all slots that are not disabled
        const availableSlots = day.availability.slots.filter(
          (slot) => !slot.isDisabled
        );

        if (availableSlots.length > 0) {
          const firstSlot = availableSlots[0].time;
          const lastSlot = availableSlots[availableSlots.length - 1].time;

          const firstHour = parseInt(firstSlot.split(":")[0]);
          const lastHour = parseInt(lastSlot.split(":")[0]);

          earliestHour = Math.min(earliestHour, firstHour);
          latestHour = Math.max(latestHour, lastHour);
        }
      }
    });

    // Also check bookings for additional time range
    if (bookings.length > 0) {
      bookings.forEach((booking) => {
        const startHour = parseInt(booking.start_time.split(":")[0]);
        const endHour = parseInt(booking.end_time.split(":")[0]);

        earliestHour = Math.min(earliestHour, startHour);
        latestHour = Math.max(latestHour, endHour);
      });
    }

    // If no available slots or bookings were found, return default range
    if (earliestHour === 24 && latestHour === 0) {
      return {
        start: 0,
        end: 24,
      };
    }

    // Ensure we include the full range
    return {
      start: Math.max(0, earliestHour), // Show one hour before the earliest slot
      end: Math.min(24, latestHour + 1), // Show one hour after the latest slot
    };
  };
  const handleAvailabilityModalSubmit = (data: any) => {
    // Validate times only if the day is available
    if (available) {
      // Check if any times are empty
      const hasEmptyTimes =
        (!data.phone.from && data.phone.to) ||
        (data.phone.from && !data.phone.to) ||
        (!data.in_person.from && data.in_person.to) ||
        (data.in_person.from && !data.in_person.to) ||
        (!data.break.from && data.break.to) ||
        (data.break.from && !data.break.to);

      if (hasEmptyTimes) {
        setSnackbar({
          open: true,
          message:
            "Please provide both start and end times for each selected availability",
          severity: "error",
        });
        return;
      }

      // Check for invalid time ranges
      const isPhoneValid =
        !data.phone.from ||
        dayjs(`2024-01-01 ${data.phone.from}`).isBefore(
          dayjs(`2024-01-01 ${data.phone.to}`)
        );
      const isInPersonValid =
        !data.in_person.from ||
        dayjs(`2024-01-01 ${data.in_person.from}`).isBefore(
          dayjs(`2024-01-01 ${data.in_person.to}`)
        );
      const isBreakValid =
        !data.break.from ||
        dayjs(`2024-01-01 ${data.break.from}`).isBefore(
          dayjs(`2024-01-01 ${data.break.to}`)
        );

      if (!isPhoneValid || !isInPersonValid || !isBreakValid) {
        setSnackbar({
          open: true,
          message: "End time must be after start time",
          severity: "error",
        });
        return;
      }

      // Check for overlapping times
      const { hasOverlap, message } = checkAvailabilityOverlap(
        data.phone,
        data.in_person
      );

      if (hasOverlap) {
        setSnackbar({
          open: true,
          message,
          severity: "error",
        });
        return;
      }
    }

    // Create a new availability object with the form data
    const newAvailability = {
      phone: data.phone,
      in_person: data.in_person,
      break: data.break,
      is_available: available,
    };

    // Update the local weeklyAvailability state
    const updatedAvailability = { ...transformedWeeklyAvailability };
    checkedDays.forEach((day) => {
      const dayKey = dayMapping[day].toLowerCase();
      updatedAvailability[dayKey] = newAvailability;
    });
    if (updatedAvailability) {
      setValuesChanged(true);
    }
    // Update both states to ensure consistency
    setWeeklyAvailability(updatedAvailability);
    setTransformedWeeklyAvailability(updatedAvailability);

    setIsAvailabilityModalOpen(false);
    
   
  };

  const handleSaveAvailability = async () => {
    setLoading(true);
    try {
      const formattedAvailabilities = Object.keys(weeklyAvailability).map(
        (day: string) => ({
          day_of_week: day.toLowerCase(),
          phone_start_time:
            weeklyAvailability[day].phone && weeklyAvailability[day].phone.from
              ? weeklyAvailability[day].phone.from
              : null,
          phone_end_time:
            weeklyAvailability[day].phone && weeklyAvailability[day].phone.to
              ? weeklyAvailability[day].phone.to
              : null,
          in_person_start_time:
            weeklyAvailability[day].in_person &&
            weeklyAvailability[day].in_person.from
              ? weeklyAvailability[day].in_person.from
              : null,
          in_person_end_time:
            weeklyAvailability[day].in_person &&
            weeklyAvailability[day].in_person.to
              ? weeklyAvailability[day].in_person.to
              : null,
          break_start_time:
            weeklyAvailability[day].break && weeklyAvailability[day].break.from
              ? weeklyAvailability[day].break.from
              : null,
          break_end_time:
            weeklyAvailability[day].break && weeklyAvailability[day].break.to
              ? weeklyAvailability[day].break.to
              : null,
        })
      );

      if (
        formattedAvailabilities.length === 0 ||
        !formattedAvailabilities.some(
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
        setLoading(false);
        return;
      }

      const payload = {
        user_id: userDetails?.user_id,
        availabilities: formattedAvailabilities,
      };

      await postAvailabilityGeneral(payload);

      // Refresh the availability data
      await fetchInitialAvailability();

      setOpenEditAvailability(false);
      setCheckedDays([]); // Reset checked days after saving

      setSnackbar({
        open: true,
        message: "Availability updated successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to update availability:", error);
      setSnackbar({
        open: true,
        message: "Failed to update availability",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setValuesChanged(false);
    }
  };

  // const handleEditAvailabilityClick = (
  //   event: React.MouseEvent<HTMLButtonElement>
  // ) => {
  //   setAnchorEl1(event.currentTarget);
  // };
  const handleClearAppointment = async (appointmentId: string) => {
    setLoadingClearAppointment(true);
    try {
      await clearBooking({ booking_ids: [Number(appointmentId)] });
      fetchBookings();
    } catch (error) {
      console.error("Failed to clear appointment:", error);
    } finally {
      setLoadingClearAppointment(false);
      setClearAppointment(false);
    }
  };
  return (
    <Box display={"grid"} gridTemplateColumns={"2fr 1fr"} gap={2}>
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <IconButton
            onClick={() => {
              setChanged(true);
              handlePreviousWeek();
            }}
          >
            <img src={leftArrow} alt="previous week" />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="bodyLargeMedium">
              {formatDateRange()}
            </Typography>
          </Box>
          <IconButton
            onClick={() => {
              setChanged(true);
              handleNextWeek();
            }}
          >
            <img src={rightArrow} alt="next week" />
          </IconButton>
          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <img src={calendarIcon} alt="calendar" />
          </IconButton>
          <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <Box sx={{ p: 2 }}>
              <DatePicker
                selectsRange={true}
                startDate={startDate}
                endDate={endDate}
                onChange={(update) => {
                  const weekStart = dayjs(update[0]).startOf("week").toDate();
                  const weekEnd = dayjs(update[0]).endOf("week").toDate();
                  setToday(dayjs(update[0]));
                  if (update[0]) {
                    setDateRange([weekStart, weekEnd]);
                    setAnchorEl(null);
                  }
                }}
                inline
              />
            </Box>
          </Popover>
        </Box>
        <Paper elevation={1} sx={{ p: 0 }}>
          <Box>
            <Grid
              container
              width={"100%"}
              display={"flex"}
              spacing={2}
              sx={{
                height: "60px",
                borderBottom: "1px solid #EDF2F7",
              }}
            >
              <Box
                sx={{
                  height: "60px",
                  width: "63px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderBottom: "1px solid #EDF2F7",
                }}
              />
              {days.map((day) => (
                <Grid
                  key={day.day}
                  sx={{
                    opacity: 1,
                    position: "relative",
                    cursor: "pointer",
                  }}
                  flexGrow={1}
                  // onClick={() => setToday(dayjs(day.fullDate))}
                >
                  <DayHeader
                    isToday={day.fullDate == dayjs(today).format("YYYY-MM-DD")}
                    day={day.day}
                    date={day.fullDate}
                    onEditAvailability={() => handleEditAvailability(day.day)}
                    onClearDay={() => handleClearDay(day.day)}
                    isAvailable={day.availability.isAvailable}
                    onClickOnDay={() => setToday(dayjs(day.fullDate))}
                    isBeforeToday={dayjs(day.fullDate).isBefore(dayjs(), "day")}
                  />
                </Grid>
              ))}
            </Grid>
            <Box
              display="flex"
              sx={{ height: "calc(100vh - 260px)", overflowY: "auto" }}
            >
              <Box width={"100%"} sx={{ minWidth: "80px" }}>
                {!loading ? (
                  getSlots().map((hour, index) => {
                    const booking = findBookingForTimeSlot(hour.time);
                    return (
                      <Box
                        key={index}
                        sx={{
                          height: "60px",
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "start",
                          borderBottom: "1px solid #EDF2F7",
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="grey.500"
                          sx={{
                            width: "80px",
                            borderRight: "1px solid #EDF2F7",
                            p: 1,
                            height: "60px",
                            alignItems: "center",
                            justifyContent: "center",
                            display: "flex",
                          }}
                        >
                          {hour.time}
                        </Typography>
                        <Box
                          sx={{
                            paddingLeft: "20px",
                            paddingRight: "20px",
                            width: "100%",
                          }}
                          display={"flex"}
                          alignItems={"center"}
                          gap={1}
                        >
                          {(booking || !hour.isDisabled) && (
                            <>
                              <Box
                                sx={{
                                  cursor: isPastDateTime(
                                    dayjs(today).toDate(),
                                    hour.time
                                  )
                                    ? "not-allowed"
                                    : "pointer",
                                  opacity: isPastDateTime(
                                    dayjs(today).toDate(),
                                    hour.time
                                  )
                                    ? 0.6
                                    : 1,
                                }}
                                onClick={(e) => {
                                  if (
                                    isPastDateTime(
                                      dayjs(today).toDate(),
                                      hour.time
                                    )
                                  ) {
                                    return; // Prevent click action if it's a past date/time
                                  }

                                  // Always set isEditing based on whether we're editing an existing booking
                                  setIsEditing(booking?.status === "active");

                                  if (booking?.status === "active") {
                                    setMenuAnchorEl(e.currentTarget);
                                    setAppointmentId(
                                      booking.booking_id.toString()
                                    );
                                    setAppointmentStatus("active");

                                    reset({
                                      contact: {
                                        firstName: booking.first_name,
                                        lastName: booking.last_name,
                                        email: booking.email,
                                        phone: booking.phone,
                                        title: booking.phone || "",
                                      },
                                      date: dayjs(
                                        booking.date.split("T")[0]
                                      ).toDate(), // Ensure date is a Date object
                                      startTime: booking.start_time.substring(
                                        0,
                                        5
                                      ),
                                      length: dayjs(
                                        booking.end_time,
                                        "HH:mm:ss"
                                      )
                                        .diff(
                                          dayjs(booking.start_time, "HH:mm:ss"),
                                          "minute"
                                        )
                                        .toString(),
                                      booking_type: EnBookingType.IN_PERSON,
                                      reasonForCall: booking.details,
                                    });
                                  } else {
                                    // For cancelled bookings or empty slots
                                    if (
                                      isPastDateTime(
                                        dayjs(today).toDate(),
                                        hour.time
                                      )
                                    ) {
                                      setOpenDialog(false);
                                    } else {
                                      setOpenDialog(true);
                                      setAppointmentId(null);
                                      setAppointmentStatus(null);

                                      // Ensure we're setting the correct date (today) and time (from hour)
                                      reset({
                                        contact: {
                                          firstName: "",
                                          lastName: "",
                                          email: "",
                                          phone: "",
                                          title: "",
                                        },
                                        date: dayjs(today).toDate(), // Ensure date is a Date object
                                        startTime: hour.time,
                                        length: "15",
                                        booking_type: EnBookingType.IN_PERSON,
                                        reasonForCall: "",
                                      });
                                    }
                                  }
                                }}
                              >
                                <StatusIcon
                                  status={
                                    booking && booking.status
                                      ? booking.status === "active"
                                        ? 1
                                        : booking.status === "cancelled"
                                        ? 2
                                        : 3
                                      : 0
                                  }
                                />
                              </Box>
                              <BookingTypeIcon
                                bookingType={
                                  booking ? booking.booking_type : ""
                                }
                              />
                            </>
                          )}
                          {booking ? (
                            <>
                              <Typography
                                variant="caption"
                                color="#1A202C"
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  lineHeight: "21px",
                                  padding: "3px 8px",
                                  borderRadius: "100px",
                                  cursor: isPastDateTime(
                                    dayjs(booking.date.split("T")[0]).toDate(),
                                    booking.start_time
                                  )
                                    ? "not-allowed"
                                    : "pointer",
                                  backgroundColor:
                                    booking.status === "active"
                                      ? "#22C55E"
                                      : booking.status === "cancelled"
                                      ? "#FF4747"
                                      : "#FACC15",
                                }}
                                onClick={(e) => {
                                  if (
                                    !isPastDateTime(
                                      dayjs(
                                        booking.date.split("T")[0]
                                      ).toDate(),
                                      booking.start_time
                                    )
                                  ) {
                                    if (booking?.status === "active") {
                                      setMenuAnchorEl(e.currentTarget);
                                      setAppointmentId(
                                        booking.booking_id.toString()
                                      );
                                      setAppointmentStatus("active");
                                      reset({
                                        contact: {
                                          firstName: booking.first_name,
                                          lastName: booking.last_name,
                                          email: booking.email,
                                          phone: booking.phone,
                                          title: booking.phone,
                                        },
                                        date: dayjs(booking.date.split("T")[0]),
                                        startTime: booking.start_time.substring(
                                          0,
                                          5
                                        ),
                                        length: dayjs(
                                          booking.end_time,
                                          "HH:mm:ss"
                                        )
                                          .diff(
                                            dayjs(
                                              booking.start_time,
                                              "HH:mm:ss"
                                            ),
                                            "minute"
                                          )
                                          .toString(),
                                        booking_type: EnBookingType.IN_PERSON,
                                        reasonForCall: booking.details,
                                      });
                                    }
                                  } else {
                                    return;
                                  }
                                  if (booking?.status === "cancelled") {
                                    setMenuAnchorEl(e.currentTarget);
                                    setAppointmentId(
                                      booking.booking_id.toString()
                                    );
                                    setAppointmentStatus("cancelled");
                                    reset({
                                      date: dayjs(today),
                                      startTime: hour.time,
                                      length: "15",
                                      booking_type: EnBookingType.IN_PERSON,
                                      reasonForCall: "",
                                    });
                                  }
                                }}
                              >
                                {booking?.first_name} {booking?.last_name}
                              </Typography>
                              <Tooltip title={booking?.details}>
                                <Typography
                                  variant="bodySmallMedium"
                                  color="grey.600"
                                  sx={{
                                    maxWidth: "300px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {booking?.details}
                                </Typography>
                              </Tooltip>
                            </>
                          ) : hour.isDisabled ? (
                            <Typography
                              variant="caption"
                              color="#1A202C"
                              sx={{
                                fontSize: "14px",
                                fontWeight: "500",
                                lineHeight: "21px",
                                padding: "3px 8px",
                                borderRadius: "100px",
                                backgroundColor: "#38BDF8",
                                minWidth: "100%",
                                textAlign: "center",
                              }}
                            >
                              Do Not Book
                            </Typography>
                          ) : (
                            <Box
                              onClick={() => {
                                // setSelectedTime(hour.time);

                                if (
                                  isPastDateTime(
                                    dayjs(today).toDate(),
                                    hour.time
                                  )
                                ) {
                                  setOpenDialog(false);
                                } else {
                                  setOpenDialog(true);
                                }
                                setAppointmentId(null);
                                setAppointmentStatus(null);
                                reset({
                                  date: dayjs(today),
                                  startTime: hour.time,
                                  length: "15",
                                  booking_type: EnBookingType.IN_PERSON,
                                  reasonForCall: "",
                                });
                              }}
                              sx={{
                                cursor: isPastDateTime(
                                  dayjs(today).toDate(),
                                  hour.time
                                )
                                  ? "not-allowed"
                                  : "pointer",
                              }}
                            >
                              <Typography
                                variant="caption"
                                color="#1A202C"
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: "500",
                                  lineHeight: "21px",
                                  padding: "3px 8px",
                                  borderRadius: "100px",
                                  backgroundColor: "#E2E8F0",
                                }}
                              >
                                Empty
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      </Box>
                    );
                  })
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      p: 3,
                      height: "calc(100vh - 260px)",
                      alignItems: "center",
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
      <Box>
        <Paper
          elevation={1}
          sx={{
            p: "10px",
            border: "1px solid #E2E8F0",
            borderRadius: "16px",
            marginBottom: "10px",
          }}
        >
          <Box>
            <ConfirmAppointments />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}></Box>
          </Box>
        </Paper>
        <Paper
          elevation={1}
          sx={{ p: 2 }}
          onClick={() => setOpenEditAvailability(true)}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography
                variant="bodyLargeMedium"
                sx={{ fontWeight: "800", fontSize: "14px", lineHeight: "21px" }}
              >
                {openEditAvailability ? "Edit Availability" : " Availability"}
              </Typography>
              {/* <IconButton
                onClick={handleEditAvailabilityClick}
                sx={{ border: "1px solid #E2E8F0", borderRadius: "12px" }}
              >
                <img src={otherIcons.dotsVertical} alt="dotsVertical" />
              </IconButton> */}
              {/* <Menu
                id="day-menu"
                anchorEl={anchorEl1}
                open={open}
                sx={{
                  "& .MuiPaper-root": {
                    backdropFilter: "blur(5px)",
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
                  onClick={() => {
                    setOpenEditAvailability(true);
                    handleClose();
                  }}
                  sx={menuItemHoverStyle}
                >
                  <Box component="img" alt="edit" src={edit} />
                  <Typography variant="bodySmallSemiBold" color="grey.600">
                    Edit Availability
                  </Typography>
                </MenuItem>
              </Menu> */}
            </Box>

            <SetAvailabilityForm
             
              availabilityForm={availabilityForm}
              handleAvailabilitySubmit={availabilityForm.handleSubmit(
                handleAvailabilityModalSubmit
              )}
              available={available}
              setAvailable={setAvailable}
              repeat={repeat}
              setRepeat={setRepeat}
              checkedDays={checkedDays}
              handleCheckboxChange={handleCheckboxChange}
              handleDayClick={openEditAvailability ? handleDayClick : undefined}
              formatTimeSlot={formatTimeSlot}
              weeklyAvailability={transformedWeeklyAvailability}
              dayMapping={dayMapping}
              isAvailabilityModalOpen={isAvailabilityModalOpen}
              setIsAvailabilityModalOpen={setIsAvailabilityModalOpen}
              loading={loading}
              snackbar={snackbar}
              handleSnackbarClose={handleSnackbarClose}
            />

            {valuesChanged && (
              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mt: 4,
                  justifyContent: "space-around",
                }}
              >
                <CommonButton
                  variant="outlined"
                  onClick={() => {
                    // setOpenEditAvailability(false);
                    setValuesChanged(false);
                    setCheckedDays([]);
                    setRepeat(false);
                    setAvailable(true);
                    // Reset availability data to original server values
                    setWeeklyAvailability({ ...transformedWeeklyAvailability });
                    setTransformedWeeklyAvailability(
                      mapAvailabilitiesToWeekly(availabilities, {
                        monday: "monday",
                        tuesday: "tuesday",
                        wednesday: "wednesday",
                        thursday: "thursday",
                        friday: "friday",
                        saturday: "saturday",
                        sunday: "sunday",
                      })
                    );
                    // Reset the availability form
                    availabilityForm.reset({
                      phone: { from: "", to: "" },
                      in_person: { from: "", to: "" },
                      break: { from: "", to: "" },
                    });
                  }}
                  text="Cancel"
                  sx={{
                    borderColor: "grey.200",
                    color: "grey.500",
                    "&:hover": {
                      borderColor: "grey.300",
                    },
                  }}
                  fullWidth
                />
                <CommonButton
                  variant="contained"
                  text="Save"
                  fullWidth
                  onClick={handleSaveAvailability}
                  disabled={loading}
                />
              </Box>
            )}
          </Box>
        </Paper>

        {/* <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            startIcon={<img src={otherIcons.link} alt="link" />}
            fullWidth
            sx={{
              fontSize: "14px",
              height: "47px",
              borderRadius: "8px",
              borderColor: "grey.200",
              color: "white",
              backgroundColor: "#358FF7",
              "&:hover": {
                borderColor: "grey.300",
                backgroundColor: "grey.50",
              },
            }}
          >
            Link Calendar
          </Button>
          <Button
            variant="outlined"
            startIcon={<img src={otherIcons.plus} alt="plus" />}
            fullWidth
            sx={{
              fontSize: "14px",
              height: "47px",
              borderRadius: "8px",
              borderColor: "grey.200",
              color: "white",
              backgroundColor: "#358FF7",
              "&:hover": {
                borderColor: "grey.300",
                backgroundColor: "grey.50",
              },
            }}
          >
            Upload ICS
          </Button>
        </Box> */}
      </Box>
      <CommonDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          setIsEditing(false);
          reset();
        }}
        confirmButtonType="primary"
        title={isEditing ? "Edit Appointment" : "New Appointment"}
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={handleSubmit(onSubmit)}
        loading={loading}
        disabled={loading}
      >
        <SlotBookingForm
          selectedTime={""}
          control={control}
          errors={errors}
          openContactSearch={openContactSearch}
          handleClose={() => setOpenContactSearch(false)}
          handleOpen={() => setOpenContactSearch(true)}
          options={options}
          loading={{ input: false }}
          shouldDisableDate={() => false}
          selectedDate={dayjs(today)}
          isEditing={isEditing}
        />
      </CommonDialog>
      {/* Clear Availability Dialog */}
      <CommonDialog
        open={clearAppointment}
        onClose={() => setClearAppointment(false)}
        title="Clear Appointment"
        confirmText="Clear"
        cancelText="Cancel"
        onConfirm={() => handleClearAppointment(appointmentId!)}
        confirmButtonType="error"
        loading={loadingClearAppointment}
        disabled={loadingClearAppointment}
      >
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mt: 2 }}>
          <Typography variant="bodyMediumExtraBold" color="grey.600">
            Are you sure you want to clear this appointment?
          </Typography>
          <Typography
            variant="bodySmallSemiBold"
            color="grey.500"
            sx={{ mt: 1 }}
          >
            This action cannot be undone.
          </Typography>
        </Box>
      </CommonDialog>
      <CommonDialog
        open={openCancelDialog}
        onClose={() => {
          setOpenCancelDialog(false);
          resetCancel();
        }}
        confirmButtonType="error"
        title="Cancel Appointment"
        confirmText="Confirm"
        cancelText="Back"
        onConfirm={handleCancelSubmit(onCancelSubmit)}
        loading={loading}
        disabled={loading}
      >
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="bodyMediumExtraBold" color="grey.600">
            Reason for Cancellation
          </Typography>
          <Controller
            name="reasonForCancelling"
            control={cancelControl}
            render={({ field }) => (
              <CommonTextField
                {...field}
                select
                fullWidth
                error={!!cancelErrors.reasonForCancelling}
                helperText={cancelErrors.reasonForCancelling?.message}
              >
                {CANCELLATION_REASONS.map((reason) => (
                  <MenuItem key={reason} value={reason}>
                    {reason}
                  </MenuItem>
                ))}
              </CommonTextField>
            )}
          />
        </Box>
      </CommonDialog>
      <CommonSnackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
        sx={{
          "& .MuiPaper-root": {
            backdropFilter: "blur(3px)",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            border: "1px solid #718096",
            p: 0,
            borderTopLeftRadius: 0,
          },
        }}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        {appointmentStatus === "active" ? (
          // Options for active appointments
          [EnBookings.Edit, EnBookings.Cancel].map((option) => (
            <MenuItem
              key={option}
              sx={{ justifyContent: "start", gap: 1 }}
              onClick={() => {
                if (option === EnBookings.Edit) {
                  setOpenDialog(true);
                  setIsEditing(true);
                } else {
                  setOpenCancelDialog(true);
                }
                setMenuAnchorEl(null);
              }}
            >
              <StatusIcon status={option} />
              <Typography variant="bodySmallSemiBold" color="grey.500">
                {EnBookings[option]}
              </Typography>
            </MenuItem>
          ))
        ) : (
          // Options for cancelled appointments
          <>
            <MenuItem
              sx={{ justifyContent: "start", gap: 1 }}
              onClick={() => {
                setOpenDialog(true);
                setIsEditing(false);
                setAppointmentId(null);
                setMenuAnchorEl(null);

                // Pre-fill the form with the date and time of the cancelled appointment
                const cancelledBooking = bookings.find(
                  (booking) => booking.booking_id.toString() === appointmentId
                );
                if (cancelledBooking) {
                  reset({
                    contact: {
                      firstName: "",
                      lastName: "",
                      email: "",
                      phone: "",
                      title: "",
                    },
                    date: dayjs(cancelledBooking.date.split("T")[0]).toDate(),
                    startTime: cancelledBooking.start_time.substring(0, 5),
                    length: "15",
                    booking_type: EnBookingType.IN_PERSON,
                    reasonForCall: "",
                  });
                }
              }}
            >
              <StatusIcon status={6} />
              <Typography variant="bodySmallSemiBold" color="grey.500">
                Add Appointment
              </Typography>
            </MenuItem>
            <MenuItem
              sx={{ justifyContent: "start", gap: 1 }}
              onClick={() => {
                setClearAppointment(true);
                setMenuAnchorEl(null);
              }}
            >
              <StatusIcon status={7} />
              <Typography variant="bodySmallSemiBold" color="grey.500">
                Clear Appointment
              </Typography>
            </MenuItem>
          </>
        )}
      </Menu>
    </Box>
  );
}
