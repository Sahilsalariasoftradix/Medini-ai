import { Box, FormHelperText, MenuItem, Typography } from "@mui/material";
import CommonTextField from "../../common/CommonTextField";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import questionMark from "../../../assets/icons/question.svg";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { calenderIcon } from "../../Booking/Form/SlotBookingForm";
import { useState, useEffect } from "react";
import { Dayjs } from "dayjs";
import CommonButton from "../../common/CommonButton";
import {
  EditAppointmentSchema,
  EditAppointmentSchemaType,
  useAppointmentChecker,
} from "../../../store/AppointmentCheckerContext";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import {
  getAvailability,
  getBookings,
  getCustomerBookings,
  updateBooking,
} from "../../../api/userApi";
import { IAvailability, IGetBookingFiltered } from "../../../utils/Interfaces";
import {
  EnBookingDuration,
  EnBookingType,
  EnGetBookingRange,
} from "../../../utils/enums";
import { CircularProgress } from "@mui/material";

dayjs.extend(isSameOrAfter);

const EditAppointment = () => {
  const {
    step,
    setStep,
    existingAppointmentData,
    userBookings,
    selectedBookingId,
    setSnackbar,
    setUserBookings,
    existingPhone,
  } = useAppointmentChecker();

  // Get the selected booking based on ID
  const currentBooking =
    userBookings?.find((booking) => booking.booking_id === selectedBookingId) ||
    userBookings?.[0] ||
    null;

  // Parse the date and time from the selected booking data
  const bookingDate = currentBooking ? dayjs(currentBooking.date) : null;
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(bookingDate);
  const [availability, setAvailability] = useState<IAvailability[]>([]);
  const [bookings, setBookings] = useState<IGetBookingFiltered[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm<EditAppointmentSchemaType>({
    resolver: zodResolver(EditAppointmentSchema),
    defaultValues: {
      first_name: currentBooking?.booking_first_name || "",
      last_name: currentBooking?.booking_last_name || "",
      phone: currentBooking?.phone || "",
      email: currentBooking?.email || "",
      appointmentType: currentBooking.booking_type || EnBookingType.IN_PERSON,
      date: currentBooking
        ? dayjs(currentBooking.date).format("YYYY-MM-DD")
        : undefined,
      time: currentBooking ? currentBooking.start_time.slice(0, 5) : undefined,
      length: calculateAppointmentLength(currentBooking) || "15",
    },
  });

  // Update form when selected booking changes
  useEffect(() => {
    if (currentBooking) {
      reset({
        first_name: currentBooking.booking_first_name || "",
        last_name: currentBooking.booking_last_name || "",
        phone: currentBooking.phone || "",
        email: currentBooking.email || "",
        appointmentType: currentBooking.booking_type || EnBookingType.IN_PERSON,
        date: dayjs(currentBooking.date).format("YYYY-MM-DD"),
        time: currentBooking.start_time.slice(0, 5),
        length: calculateAppointmentLength(currentBooking),
      });

      // Update date and time pickers
      setSelectedDate(dayjs(currentBooking.date));
      // setSelectedTime(dayjs(`2023-01-01T${currentBooking.start_time}`));
    }
  }, [currentBooking, existingAppointmentData, reset]);
  
  useEffect(() => {
    const refreshBookings = async () => {
      try {
        if (currentBooking?.company_id && existingPhone) {
          const updatedBookings = await getCustomerBookings(
            Number(currentBooking.company_id),
            existingPhone
          );
          setUserBookings(updatedBookings);
        }
      } catch (error) {
        console.error("Failed to refresh bookings:", error);
      }
    };

    refreshBookings();
  }, [currentBooking?.company_id, existingPhone]);

  // Function to generate time slots in 15-minute intervals
  const generateTimeSlots = (startTime: string, endTime: string): string[] => {
    const slots: string[] = [];
    const start = dayjs(`2000-01-01 ${startTime}`);
    const end = dayjs(`2000-01-01 ${endTime}`);

    let current = start;
    while (current.isBefore(end)) {
      slots.push(current.format("HH:mm"));
      current = current.add(15, "minute");
    }

    return slots;
  };

  // Helper function to calculate appointment length in minutes
  function calculateAppointmentLength(booking: any) {
    if (!booking) return "15";

    try {
      const startTime = booking.start_time.slice(0, 5);
      const endTime = booking.end_time.slice(0, 5);

      const [startHour, startMinute] = startTime.split(":").map(Number);
      const [endHour, endMinute] = endTime.split(":").map(Number);

      const startMinutes = startHour * 60 + startMinute;
      const endMinutes = endHour * 60 + endMinute;

      const diffMinutes = endMinutes - startMinutes;

      // Round to nearest available option (15, 30, 45, 60)
      if (diffMinutes <= 15) return "15";
      if (diffMinutes <= 30) return "30";
      if (diffMinutes <= 45) return "45";
      return "60";
    } catch (e) {
      return "15";
    }
  }

  // Filter times based on selected date and appointment type
  const getFilteredTimes = () => {
    const date = selectedDate;
    const appointmentType = watch("appointmentType");

    if (!date || !appointmentType || !availability.length) return [];

    const dayOfWeek = date.format("dddd").toLowerCase(); // Convert to lowercase to match API response

    // Find availability for the selected day
    const dayAvailability = availability.find(
      (avail) => avail?.day_of_week?.toLowerCase() === dayOfWeek
    );

    if (!dayAvailability) return [];

    const breakStart = dayAvailability.break_start_time;
    const breakEnd = dayAvailability.break_end_time;

    let availableSlots: { time: string; type: string }[] = [];

    // Generate in-person slots
    if (
      dayAvailability.in_person_start_time &&
      dayAvailability.in_person_end_time
    ) {
      const inPersonSlots = generateTimeSlots(
        dayAvailability.in_person_start_time,
        dayAvailability.in_person_end_time
      );

      // Filter out break time
      const filteredInPersonSlots = inPersonSlots.filter((slot) => {
        const slotTime = dayjs(`2000-01-01 ${slot}:00`);
        const breakStartTime = dayjs(`2000-01-01 ${breakStart}`);
        const breakEndTime = dayjs(`2000-01-01 ${breakEnd}`);

        return !(
          slotTime.isAfter(breakStartTime) && slotTime.isBefore(breakEndTime)
        );
      });

      availableSlots = [
        ...availableSlots,
        ...filteredInPersonSlots.map((slot) => ({
          time: slot,
          type: EnBookingType.IN_PERSON,
        })),
      ];
    }

    // Generate phone call slots
    if (dayAvailability.phone_start_time && dayAvailability.phone_end_time) {
      const phoneSlots = generateTimeSlots(
        dayAvailability.phone_start_time,
        dayAvailability.phone_end_time
      );

      // Filter out break time
      const filteredPhoneSlots = phoneSlots.filter((slot) => {
        const slotTime = dayjs(`2000-01-01 ${slot}:00`);
        const breakStartTime = dayjs(`2000-01-01 ${breakStart}`);
        const breakEndTime = dayjs(`2000-01-01 ${breakEnd}`);

        return !(
          slotTime.isAfter(breakStartTime) && slotTime.isBefore(breakEndTime)
        );
      });

      availableSlots = [
        ...availableSlots,
        ...filteredPhoneSlots.map((slot) => ({
          time: slot,
          type: EnBookingType.PHONE,
        })),
      ];
    }

    // Mark slots available for both types
    const slotMap = new Map<string, string>();
    availableSlots.forEach((slot) => {
      if (slotMap.has(slot.time)) {
        slotMap.set(slot.time, EnBookingType.BOTH);
      } else {
        slotMap.set(slot.time, slot.type);
      }
    });

    // Convert map back to array
    const uniqueSlots = Array.from(slotMap.entries()).map(([time, type]) => ({
      time,
      type,
    }));

    // Sort slots by time
    uniqueSlots.sort((a, b) => a.time.localeCompare(b.time));

    // Filter out already booked slots
    const filteredSlots = uniqueSlots.filter((slot) => {
      // Check if this slot conflicts with any booking
      return !bookings.some((booking: IGetBookingFiltered) => {
        // Skip the current booking to allow selecting the same time slot
        if (currentBooking && booking.id === currentBooking.booking_id) {
          return false;
        }

        // Format times without 'T' to avoid timezone issues
        const slotTime = dayjs(`2000-01-01 ${slot.time}`);
        const bookingStart = dayjs(
          `2000-01-01 ${booking.start_time.slice(0, 5)}`
        );
        const bookingEnd = dayjs(`2000-01-01 ${booking.end_time.slice(0, 5)}`);

        // Check if the slot falls within the booking timeframe
        const slotOverlapsBooking =
          slotTime.isSameOrAfter(bookingStart) && slotTime.isBefore(bookingEnd);

        // If the slot is at the same time as any booking, it's not available
        if (slotTime.isSame(bookingStart)) {
          return true;
        }

        // For phone call appointments, check if the booking is also a phone call
        if (
          slot.type === EnBookingType.PHONE ||
          slot.type === EnBookingType.BOTH
        ) {
          if (booking.booking_type === EnBookingType.PHONE) {
            return slotOverlapsBooking;
          }
        }

        // For in-person appointments, check if the booking is also in-person
        if (
          slot.type === EnBookingType.IN_PERSON ||
          slot.type === EnBookingType.BOTH
        ) {
          if (booking.booking_type === EnBookingType.IN_PERSON) {
            return slotOverlapsBooking;
          }
        }

        return false;
      });
    });

    // Filter by appointment type
    return filteredSlots.filter((slot) => {
      if (appointmentType === EnBookingType.PHONE) {
        // For phone call appointments, show both phone call slots and in-person slots
        return true; // Show all available slots
      } else if (appointmentType === EnBookingType.IN_PERSON) {
        // For in-person appointments, only show in-person slots
        return (
          slot.type === EnBookingType.IN_PERSON ||
          slot.type === EnBookingType.BOTH
        );
      }
      return false;
    });
  };

  // Effects to update available times when date, practitioner, or appointment type changes
  useEffect(() => {
    getFilteredTimes();
  }, [watch("appointmentType")]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        if (currentBooking?.user_id) {
          const availability = await getAvailability({
            user_id: Number(currentBooking.user_id),
            date: selectedDate!.format("YYYY-MM-DD"),
            range: EnGetBookingRange.DAY,
          });
          setAvailability(availability.availability);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    const fetchBookings = async () => {
      if (currentBooking?.user_id) {
        const bookings = await getBookings({
          user_id: Number(currentBooking.user_id),
          date: selectedDate!.format("YYYY-MM-DD"),
          range: EnGetBookingRange.DAY,
        });
        setBookings(bookings.bookings);
      }
    };

    fetchAvailability();
    fetchBookings();
  }, [selectedDate, currentBooking]);

  const [submitting, setSubmittingState] = useState(false);

  const onSubmit = async (data: any) => {
    setSubmittingState(true);
    try {
      // Calculate end time based on appointment length
      const timeArray = data.time.split(":").map(Number);
      const [hours, minutes] = timeArray;
      const startTime = new Date();
      startTime.setHours(hours, minutes, 0, 0);

      // Add appointment length (in minutes)
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + Number(data.length));

      // Create payload similar to createBooking
      const payload = {
        booking_id: currentBooking?.booking_id || selectedBookingId,
        user_id: Number(currentBooking?.user_id),
        date: selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : "",
        start_time: data.time,
        end_time: `${endTime.getHours()}:${String(
          endTime.getMinutes()
        ).padStart(2, "0")}`,
        details: currentBooking?.details || "",
        booking_type: data.appointmentType,
        email: data.email,
        first_name: data.first_name,
        last_name: data.last_name,
        phone: data.phone,
      };

      await updateBooking(payload);

      // Refresh bookings data after successful update
      if (currentBooking?.company_id && existingPhone) {
        const updatedBookings = await getCustomerBookings(
          Number(currentBooking.company_id),
          existingPhone
        );
        setUserBookings(updatedBookings);
      }

      setSnackbar({
        open: true,
        message: "Appointment updated successfully",
        severity: "success",
      });

      // Navigate back to previous step after successful update
      setTimeout(() => {
        setStep(step - 1);
      }, 500);
    } catch (error: any) {
      console.error("Update error:", error);
      setSnackbar({
        open: true,
        message: error.message || "Failed to update appointment",
        severity: "error",
      });
    } finally {
      setSubmittingState(false);
    }
  };

  return (
    <Box>
      <Typography
        align="center"
        variant="h3"
        my={2}
        sx={{ fontSize: { xs: 24, md: 28 } }}
      >
        Edit Appointment
      </Typography>
      <Typography
        align="center"
        variant="bodyLargeMedium"
        sx={{ mb: 5 }}
        color="grey.600"
      >
        Please verify your personal info to help us find your appointment.
      </Typography>
      <Box>
        <Typography variant="bodyMediumExtraBold">Patient Details</Typography>
        <Box my={2}>
          <Typography color="grey.600" variant="bodyMediumExtraBold">
            First Name
          </Typography>
          <CommonTextField
            placeholder="First Name"
            register={register("first_name")}
            errorMessage={errors.first_name?.message}
          />
        </Box>
        <Box my={2}>
          <Typography mt={1} color="grey.600" variant="bodyMediumExtraBold">
            Last Name
          </Typography>
          <CommonTextField
            placeholder="Last Name"
            register={register("last_name")}
            errorMessage={errors.last_name?.message}
          />
        </Box>
        <Box my={2}>
          <Typography mt={1} color="grey.600" variant="bodyMediumExtraBold">
            Phone
          </Typography>
          <CommonTextField
            placeholder="Phone"
            register={register("phone")}
            errorMessage={errors.phone?.message}
          />
        </Box>
        <Box my={2}>
          <Typography mt={1} color="grey.600" variant="bodyMediumExtraBold">
            Email
          </Typography>
          <CommonTextField
            placeholder="Email"
            register={register("email")}
            errorMessage={errors.email?.message}
          />
        </Box>
        {/* <Box my={2}>
          <Typography mt={1} color="grey.600" variant="bodyMediumExtraBold">
            Bypass key
          </Typography>
          <CommonTextField
            placeholder="Bypass key"
            register={register("bypass_key")}
            errorMessage={errors.bypass_key?.message}
          />
        </Box> */}
        {/* <Box my={2}>
          <Typography mt={1} color="grey.600" variant="bodyMediumExtraBold">
            Where is your appointment?
          </Typography>
          <Controller
            name="appointment_location"
            control={control}
            render={({ field }) => {
              const selectedOption =
                clinicOptions.find((option) => option.value === field.value) ||
                null;

              return (
                <SearchInput
                  options={clinicOptions}
                  placeholder="Search for your appointment"
                  value={selectedOption}
                  onChange={(value) => {
                    if (
                      typeof value === "object" &&
                      value !== null &&
                      "value" in value
                    ) {
                      field.onChange(value.value);
                    } else {
                      field.onChange(value);
                    }
                  }}
                />
              );
            }}
          />
          <FormHelperText>
            {errors.appointment_location?.message}
          </FormHelperText>
        </Box> */}
        <Box my={2}>
          {/* <Typography variant="bodySmallExtraBold">Clinic Name</Typography>
          <Typography variant="bodySmallMedium">
            {existingAppointmentData?.appointment_location?.name}
          </Typography> */}
          {/* <Typography variant="bodySmallMedium">
            (651) 522-3704 x8807
          </Typography> */}
        </Box>
        <Box my={2}>
          <Typography variant="bodyMediumExtraBold">
            Appointment Details
          </Typography>

          <Typography variant="bodyMediumExtraBold" color="grey.600">
            Date
          </Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  value={selectedDate}
                  onChange={(newValue) => {
                    setSelectedDate(newValue);
                    field.onChange(
                      newValue ? dayjs(newValue).format("YYYY-MM-DD") : ""
                    );
                  }}
                  slotProps={{
                    field: {
                      //@ts-ignore
                      fullWidth: true,
                    },
                  }}
                  slots={{ openPickerIcon: calenderIcon }}
                  label=""
                />
              )}
            />
          </LocalizationProvider>
          <FormHelperText>{errors.date?.message}</FormHelperText>
        </Box>
        <Box my={2}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="bodyMediumExtraBold" color="grey.600">
              Appointment Type
            </Typography>
            <img src={questionMark} alt="" />
          </Box>
          <Controller
            name="appointmentType"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                select
                fullWidth
                error={!!errors.appointmentType}
                helperText={errors.appointmentType?.message}
              >
                <MenuItem value={EnBookingType.IN_PERSON}>In Person</MenuItem>
                <MenuItem value={EnBookingType.PHONE}>Phone Call</MenuItem>
              </CommonTextField>
            )}
          />
        </Box>
        <Box my={2}>
          <Typography variant="bodyMediumExtraBold" color="grey.600">
            Time
          </Typography>
          <Controller
            name="time"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                select
                fullWidth
                error={!!errors.time}
                helperText={
                  errors.time?.message ||
                  (getFilteredTimes().length === 0
                    ? "No available times for selected day and appointment type"
                    : "")
                }
                SelectProps={{
                  displayEmpty: true,
                  MenuProps: {
                    PaperProps: {
                      style: {
                        maxHeight: 200,
                        overflow: "auto",
                      },
                    },
                  },
                }}
                disabled={getFilteredTimes().length === 0}
              >
                {/* Always include the current appointment time */}
                {currentBooking && (
                  <MenuItem value={currentBooking.start_time.slice(0, 5)}>
                    {currentBooking.start_time.slice(0, 5)} (Current)
                  </MenuItem>
                )}

                {/* Display filtered available times */}
                {getFilteredTimes().map((timeSlot) => (
                  <MenuItem key={timeSlot.time} value={timeSlot.time}>
                    {timeSlot.time}
                  </MenuItem>
                ))}
              </CommonTextField>
            )}
          />
        </Box>
        <Box my={2}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="bodyMediumExtraBold" color="grey.600">
              Length
            </Typography>
            <img src={questionMark} alt="" />
          </Box>
          <Controller
            name="length"
            control={control}
            defaultValue="15"
            render={({ field }) => (
              <CommonTextField
                {...field}
                select
                fullWidth
                error={!!errors.length}
                helperText={errors.length?.message}
              >
                <MenuItem value={EnBookingDuration.DURATION_15}>
                  15 minutes
                </MenuItem>
                <MenuItem value={EnBookingDuration.DURATION_30}>
                  30 minutes
                </MenuItem>
                <MenuItem value={EnBookingDuration.DURATION_45}>
                  45 minutes
                </MenuItem>
                <MenuItem value={EnBookingDuration.DURATION_60}>
                  60 minutes
                </MenuItem>
              </CommonTextField>
            )}
          />
        </Box>

        <Box my={4} display="flex" gap={2}>
          <CommonButton
            text="Cancel"
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => {
              setStep(step - 1);
            }}
            disabled={submitting}
          />
          <CommonButton
            text={submitting ? "Processing..." : "Edit Appointment"}
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit(onSubmit)}
            disabled={submitting}
            startIcon={
              submitting ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {submitting ? "Processing..." : "Edit Appointment"}
          </CommonButton>
        </Box>
      </Box>
    </Box>
  );
};

export default EditAppointment;
