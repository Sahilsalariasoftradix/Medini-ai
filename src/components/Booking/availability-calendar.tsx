import {
  Box,
  Paper,
  IconButton,
  Typography,
  Popover,
  Menu,
  MenuItem,
  Divider,
  CircularProgress,
} from "@mui/material";
import { DayHeader } from "./day-header";
import { StatusTotals } from "./status-total";
import Grid from "@mui/material/Grid2";
import React, { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import calendarIcon from "../../assets/icons/calenderIcon.svg";
import leftArrow from "../../assets/icons/left.svg";
import rightArrow from "../../assets/icons/right.svg";
import { StatusIcon } from "./status-icon";
import { EnAvailability, EnBookings, EStaticID } from "../../utils/enums";
import { useAvailability } from "../../store/AvailabilityContext";
import CommonTextField from "../common/CommonTextField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dayjs } from "dayjs";
import { topFilms } from "../../utils/staticText";
import CommonDialog from "../common/CommonDialog";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { getCurrentUserId } from "../../firebase/AuthService";
import CommonSnackbar from "../common/CommonSnackbar";
import { AlertProps } from "@mui/material";
import SlotBookingForm from "./Form/SlotBookingForm";
import { IAppointment, IBookingResponse, IFilm } from "../../utils/Interfaces";
import { cancelBooking, createBooking } from "../../api/userApi";
import { getBookings } from "../../api/userApi";
import { DaySchedule } from "../../types/calendar";

dayjs.extend(isSameOrBefore);

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

const TimeLabels = () => (
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      borderBottom: "1px solid #EDF2F7",
      backgroundColor: "grey.50",
    }}
  >
    {["00", "15", "30", "45"].map((label) => (
      <Typography
        key={label}
        variant="bodyXSmallMedium"
        sx={{
          color: "grey.600",
          padding: "4px",
          textAlign: "center",
        }}
      >
        {label}
      </Typography>
    ))}
  </Box>
);

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
  appointmentType: z.enum(["inPerson", "phoneCall"], {
    errorMap: () => ({ message: "Please select an appointment type" }),
  }),
  reasonForCall: z.string().min(1, "Reason for appointment is required"),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const cancelSchema = z.object({
  reasonForCancelling: z.string().min(1, "Cancellation reason is required"),
});

const CANCELLATION_REASONS = [
  "Schedule Conflict",
  "Personal Emergency",
  "Rescheduling Needed",
  "No Longer Required",
  "Other",
] as const;

type CancelFormData = z.infer<typeof cancelSchema>;

const getAvailableHourRange = (days: DaySchedule[]) => {
  let earliestHour = 24;
  let latestHour = 0;

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

  // If no available slots were found, return default range
  if (earliestHour === 24 && latestHour === 0) {
    return {
      start: 0,
      end: 24,
    };
  }

  // Return exact start hour and include one hour after the latest slot
  return {
    start: earliestHour, // Removed the Math.max(0, earliestHour - 1)
    end: Math.min(24, latestHour + 1), // Keep one hour buffer at the end
  };
};

const TimeSlot = ({
  status,
  onChange,
  disabled,
  time,
  date,
  availableDates,
  bookings,
  fetchBookings,
}: {
  status: EnBookings;
  onChange: (newStatus: EnBookings) => void;
  disabled?: boolean;
  time: string;
  date: Date;
  availableDates: Date[];
  bookings: IBookingResponse[];
  fetchBookings: () => Promise<void>;
}) => {
  const [selectedStatus, setSelectedStatus] = useState<EnBookings>(status);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  // const [selectedDate] = useState<Dayjs>(dayjs(date));
 
  // Search contact inputs
  const [openContactSearch, setOpenContactSearch] = useState(false);
  const [options, setOptions] = useState<readonly IFilm[]>([]);
  const [loading, setLoading] = useState({
    input: false,
    data: false,
    options: false,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      contact: {},
      date: dayjs(date),
      startTime: time,
      length: "15",
      appointmentType: "inPerson",
      reasonForCall: "",
    },
  });
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "error" as AlertProps["severity"],
  });

  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState<EnBookings | null>(null);

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

  const [appointment, setAppointment] = useState<IAppointment | null>(null);
  // const [isPartOfLongerSlot, setIsPartOfLongerSlot] = useState(false);

  const updateAppointmentStatus = useCallback(() => {
    const currentBooking = bookings.find(
      (booking) =>
        booking.start_time.substring(0, 5) === time &&
        dayjs(booking.date).format("YYYY-MM-DD") ===
          dayjs(date).format("YYYY-MM-DD")
    );

    if (currentBooking) {
      setAppointment({
        id: currentBooking.booking_id.toString(),
        startTime: currentBooking.start_time.substring(0, 5),
        status: currentBooking.status.toUpperCase(),
        length: dayjs(currentBooking.end_time, "HH:mm:ss")
          .diff(dayjs(currentBooking.start_time, "HH:mm:ss"), "minute")
          .toString(),
      });
      setAppointmentId(currentBooking.booking_id.toString());
      const newStatus = mapApiStatusToEnum(currentBooking.status);
      setSelectedStatus(newStatus);
      // Only call onChange if the status actually changed
      if (status !== newStatus) {
        onChange(newStatus);
      }
    } else {
      setAppointment(null);
      setAppointmentId(null);
      setSelectedStatus(EnBookings.Available);
      // Only call onChange if we're not already Available
      if (status !== EnBookings.Available) {
        onChange(EnBookings.Available);
      }
    }
  }, [bookings, time, date, status]);

  useEffect(() => {
    updateAppointmentStatus();
  }, [updateAppointmentStatus]);

  const handleOpen = () => {
    setOpenContactSearch(true);
    (async () => {
      setLoading({ ...loading, input: true });
      await sleep(1000); // For demo purposes.
      setLoading({ ...loading, input: false });

      setOptions([...topFilms]);
    })();
  };

  const handleClose = () => {
    setOpenContactSearch(false);
    setOptions([]);
  };
  const shouldDisableDate = (date: Dayjs) => {
    return !availableDates.some((availableDate) =>
      dayjs(availableDate).isSame(date, "day")
    );
  };

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (disabled) {
      return;
    }

    if (appointment?.parentId) {
      return;
    }

    if (selectedStatus === EnBookings.Available) {
      setOpenDialog(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const onSubmit = async (data: AppointmentFormData) => {
    setLoading({ ...loading, data: true });
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("User not authenticated");
      }
      const startTimeFormatted = dayjs(data.startTime, "HH:mm");
      const endTimeFormatted = startTimeFormatted
        .add(Number(data.length), "minute")
        .format("HH:mm");

      await createBooking({
        user_id: EStaticID.ID,
        date: dayjs(data.date).format("YYYY-MM-DD"),
        start_time: data.startTime,
        end_time: endTimeFormatted,
        details: data.reasonForCall,
        first_name: data.contact.firstName,
        last_name: data.contact.lastName,
        email: data.contact.email,
        phone: data.contact.phone,
      });
      // Fetch bookings after creating the appointment
      await fetchBookings();

      // // Display availability active as of now
      // setSelectedStatus(EnBookings.Active);
      // onChange(EnBookings.Active);
      setOpenDialog(false);
      
      reset();
    } catch (error: any) {
      console.error("Failed to create appointment:", error);
      setSnackbar({
        open: true,
        message: error.message,
        severity: "error",
      });
    } finally {
      setLoading({ ...loading, data: false });
    }
  };

  // Update the status of the booking
  const handleStatusUpdate = async (newStatus: EnBookings) => {
    try {
        // Prevent changing from Active to Available or Unconfirmed
        if (
            !appointmentId ||
            (selectedStatus === EnBookings.Active && 
            (newStatus === EnBookings.Available || newStatus === EnBookings.Unconfirmed))
        ) {
            return; // Do nothing if trying to revert to Available or Unconfirmed
        }

        if (newStatus === EnBookings.Cancelled) {
            setStatusToUpdate(newStatus);
            setOpenCancelDialog(true);
            return;
        }

        setLoading({ ...loading, options: true });
        await updateAppointmentStatus();
        setSelectedStatus(newStatus);
        onChange(newStatus);

        setSnackbar({
            open: true,
            message: "Status updated successfully",
            severity: "success",
        });
    } catch (error) {
        console.error("Failed to update status:", error);
        setSnackbar({
            open: true,
            message: "Failed to update appointment status",
            severity: "error",
        });
    } finally {
        setLoading({ ...loading, options: false });
    }
  };

  const onCancelSubmit = async () => {
    try {
      if (!appointmentId || !statusToUpdate) return;

      setLoading({ ...loading, options: true });
      await updateAppointmentStatus();
      
      // Send cancel status to the API with dynamic booking ID
      const currentBooking = bookings.find(
        (booking) => booking.booking_id.toString() === appointmentId
      );
      if (currentBooking) {
        await cancelBooking(currentBooking.booking_id);
        fetchBookings();
      }

      setSelectedStatus(statusToUpdate);
      onChange(statusToUpdate);
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
      setLoading({ ...loading, options: false });
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRight: "1px solid #EDF2F7",
          backgroundColor: disabled ? "grey.300" : "grey.50",
          opacity: disabled ? 0.5 : 1,
          cursor: disabled || appointment?.parentId ? "not-allowed" : "pointer",
          "&:hover": {
            backgroundColor: disabled || appointment?.parentId
              ? "grey.300"
              : "primary.light",
          },
          position: "relative",
        }}
      >
        <Box
          height={"100%"}
          width={"100%"}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          onClick={handleClick}
        >
          <StatusIcon
            handleClick={handleClick}
            status={selectedStatus}
            sx={{
              opacity: appointment?.parentId ? 0.5 : 1,
            }}
          />
        </Box>
      </Box>
      <CommonDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          reset();
        }}
        confirmButtonType="primary"
        title="New Appointment"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={handleSubmit(onSubmit)}
        loading={loading.data}
        disabled={loading.data}
      >

        <SlotBookingForm
          control={control}
          errors={errors}
          openContactSearch={openContactSearch}
          handleClose={handleClose}
          handleOpen={handleOpen}
          options={options}
          loading={{ input: loading.input }}
          shouldDisableDate={shouldDisableDate}
          selectedDate={dayjs(date)}
        />

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
        loading={loading.options}
        disabled={loading.options}
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
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
        {loading.options ? (
          <MenuItem>
            <CircularProgress />
          </MenuItem>
        ) : (
          [
            EnBookings.Available,
            EnBookings.Active,
            EnBookings.Cancelled,
            EnBookings.Unconfirmed,
          ].map((option) => (
            <MenuItem
              sx={{ justifyContent: "start", gap: 2 }}
              key={option}
              onClick={async () => {
                if (appointmentId) {
                  await handleStatusUpdate(option);
                } 
                setAnchorEl(null);
              }}
            >
              <StatusIcon status={option} />
              <Typography variant="bodySmallSemiBold" color="grey.500">
                {EnBookings[option]}
              </Typography>
            </MenuItem>
          ))
        )}
      </Menu>

      <CommonSnackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </>
  );
};

export default function AvailabilityCalendar() {
  const {
    days,
    dateRange,
    setDateRange,
    updateSlotStatus,
    generateDaysFromRange,
    // setDays,
    handleNextWeek,
    handlePreviousWeek,
  } = useAvailability();
  const [startDate, endDate] = dateRange;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [bookings, setBookings] = useState<IBookingResponse[]>([]);

  useEffect(() => {
    generateDaysFromRange(startDate, endDate);
  }, [startDate, endDate]);

  const fetchBookings = async () => {
    console.log('fetched')
    try {
      const response = await getBookings({
        user_id: EStaticID.ID,
        date: dayjs(startDate).format("YYYY-MM-DD"),
        range: EnAvailability.WEEK,
      });
      setBookings(response.bookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    }
  };
  
  useEffect(() => {
    fetchBookings();
  }, [startDate]); // Depend only on startDate
  

  // const fetchAppointmentsForDays = async () => {
  //   const userId = getCurrentUserId();
  //   if (!userId) return;

  //   const updatedDays = await Promise.all(
  //     days.map(async (day) => {
  //       const dayDate = dayjs(startDate).add(days.indexOf(day), "day");
  //       const appointments = (await getAppointmentsForDay(
  //         userId,
  //         dayDate.format("YYYY-MM-DD")
  //       )) as IAppointment[];

  //       return {
  //         ...day,
  //         appointments,
  //       };
  //     })
  //   );
  //   setDays(updatedDays);
  // };

  // useEffect(() => {
  //   fetchAppointmentsForDays();
  // }, [startDate, endDate]);

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
  const Today = dayjs().format("DD");

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 3,
        }}
      >
        <IconButton onClick={handlePreviousWeek}>
          <img src={leftArrow} alt="previous week" />
        </IconButton>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="bodyLargeMedium">{formatDateRange()}</Typography>
        </Box>
        <IconButton onClick={handleNextWeek}>
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
                setDateRange(update);
                if (update[0] && update[1]) {
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
          <Box
            display="flex"
            sx={{ height: "calc(100vh - 305px)", overflowY: "auto" }}
          >
            <Box sx={{ minWidth: "80px" }}>
              <Box sx={{ height: "83px" }} />
              <Box>
                {(() => {
                  const hourRange = getAvailableHourRange(days);
                  return Array.from(
                    { length: hourRange.end - hourRange.start },
                    (_, i) => i + hourRange.start
                  ).map((hour) => (
                    <Box
                      key={hour}
                      sx={{
                        height: "60px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderBottom: "1px solid #EDF2F7",
                        p: 1,
                      }}
                    >
                      <Typography variant="caption" color="grey.500">
                        {`${hour.toString().padStart(2, "0")}:00`}
                      </Typography>
                    </Box>
                  ));
                })()}
              </Box>
            </Box>

            <Grid
              flexGrow={1}
              container
              spacing={2}
              sx={{
                "& .MuiGrid2-root": {
                  position: "relative",
                  "&:not(:last-child)::after": {
                    content: '""',
                    position: "absolute",
                    right: "-8px",
                    top: 0,
                    bottom: 0,
                    width: "1px",
                    backgroundColor: "#EDF2F7",
                  },
                },
              }}
            >
              {days.map((day, dayIndex) => (
                <Grid
                  size={"grow"}
                  key={day.day}
                  sx={{
                    opacity: day.availability.isAvailable ? 1 : 0.7,
                    position: "relative",
                  }}
                >
                  <DayHeader
                    isToday={day.date == Number(Today)}
                    day={day.day}
                    date={day.date}
                    onEditAvailability={() => handleEditAvailability(day.day)}
                    onClearDay={() => handleClearDay(day.day)}
                    isAvailable={day.availability.isAvailable}
                  />
                  <Box
                    sx={{
                      height: "calc(100% - 59px)",
                      border: "1px solid #EDF2F7",
                      borderRadius: 1,
                      overflow: "hidden",
                      backgroundColor: "white",
                      position: "relative",
                    }}
                  >
                    {!day.availability.isAvailable && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: "grey.300",
                          opacity: 0.7,
                          zIndex: 1,
                        }}
                      />
                    )}
                    <TimeLabels />
                    <>
                      {(() => {
                        const hourRange = getAvailableHourRange(days);
                        return Array.from(
                          { length: hourRange.end - hourRange.start },
                          (_, hourIndex) => (
                            <Box
                              key={hourIndex}
                              sx={{
                                height: "60px",
                                borderBottom: "1px solid #EDF2F7",
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                              }}
                            >
                              {Array.from({ length: 4 }, (_, quarterIndex) => {
                                const currentHour = hourRange.start + hourIndex;
                                const currentTime = `${currentHour.toString().padStart(2, "0")}:${(
                                  quarterIndex * 15
                                )
                                  .toString()
                                  .padStart(2, "0")}`;

                                // Check if this slot should be disabled based on end time
                                const isAfterEndTime = (time: string, endTime: string) => {
                                  const [timeHour, timeMinute] = time.split(":").map(Number);
                                  const [endHour, endMinute] = endTime.split(":").map(Number);
                                  
                                  return (
                                    timeHour > endHour || 
                                    (timeHour === endHour && timeMinute >= endMinute)
                                  );
                                };

                                // Find the slot with matching time
                                const slot = day.availability.slots.find((s) => s.time === currentTime);

                                // Check if this time is at or after the end time for this day
                                const endTime = day.availability.slots.length > 0 
                                  ? day.availability.slots[day.availability.slots.length - 1].time 
                                  : "00:00";

                                const shouldDisable = !slot || isAfterEndTime(currentTime, endTime);

                                return (
                                  <TimeSlot
                                    key={quarterIndex}
                                    onChange={(newStatus) =>
                                      slot
                                        ? updateSlotStatus(
                                            dayIndex,
                                            day.availability.slots.indexOf(slot),
                                            newStatus
                                          )
                                        : undefined
                                    }
                                    status={slot?.status || EnBookings.Available}
                                    disabled={!day.availability.isAvailable || shouldDisable}
                                    time={currentTime}
                                    date={dayjs(startDate).add(dayIndex, "day").toDate()}
                                    availableDates={days
                                      .filter((d) => d.availability.isAvailable)
                                      .map((d) =>
                                        dayjs(startDate).add(days.indexOf(d), "day").toDate()
                                      )}
                                    bookings={bookings}
                                    fetchBookings={fetchBookings}
                                  />
                                );
                              })}
                            </Box>
                          )
                        );
                      })()}
                    </>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
        <Grid container>
          <Box
            width={80}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Typography
              variant="bodyMediumExtraBold"
              sx={{ color: "grey.600" }}
            >
              {" "}
              Total
            </Typography>
          </Box>

          {days.map((day) => (
            <Grid size={"grow"} key={day.day}>
              <StatusTotals
                counts={{
                  active:
                    day.appointments?.filter(
                      (apt) => Number(apt.status) === EnBookings.Active
                    ).length || 0,
                  cancelled:
                    day.appointments?.filter(
                      (apt) => Number(apt.status) === EnBookings.Cancelled
                    ).length || 0,
                  unconfirmed:
                    day.appointments?.filter(
                      (apt) => Number(apt.status) === EnBookings.Unconfirmed
                    ).length || 0,
                  available:
                    day.availability.slots.filter(
                      (slot) => slot.status === EnBookings.Available
                    ).length || 0,
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}

const mapApiStatusToEnum = (status: string): EnBookings => {
  switch (status.toLowerCase()) {
    case "active":
      return EnBookings.Active;
    case "cancelled":
      return EnBookings.Cancelled;
    case "unconfirmed":
      return EnBookings.Unconfirmed;
    default:
      return EnBookings.Available;
  }
};
