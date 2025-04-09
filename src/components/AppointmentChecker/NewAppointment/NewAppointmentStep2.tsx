import { Box, Typography, MenuItem } from "@mui/material";
import questionMark from "../../../assets/icons/question.svg";
import { useAppointmentChecker } from "../../../store/AppointmentCheckerContext";
import CommonButton from "../../common/CommonButton";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Grid from "@mui/material/Grid2";
import * as z from "zod";
import CommonTextField from "../../common/CommonTextField";
import {
  EnBookingDuration,
  EnBookingType,
  EnStepProgress,
} from "../../../utils/enums";
import StepProgress from "../StepProgress";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { useEffect, useState, useCallback } from "react";
import { calenderIcon } from "../../Booking/Form/SlotBookingForm";
import { getAvailability, getBookings } from "../../../api/userApi";

import {
  IAvailability,
  IGetBookingFiltered,
  TGetBooking,
} from "../../../utils/Interfaces";

dayjs.extend(isSameOrAfter);

// Define validation schema with zod
const validationSchema = z.object({
  businessName: z.object({
    id: z.string().min(1, "Business name is required"),
    name: z.string().min(1, "Business name is required"),
  }),
  time: z.string().min(1, "Time is required"),
  appointmentLength: z.string().min(1, "Appointment length is required"),
  appointmentType: z.string().min(1, "Appointment type is required"),
  practitioner: z.object({
    id: z.string().min(1, "Practitioner is required"),
    name: z.string().min(1, "Practitioner is required"),
  }),
  day: z.instanceof(Date, { message: "Date is required" }),
  details: z.string().min(1, "Details are required"),
});

// Create type from schema
type FormValues = z.infer<typeof validationSchema>;

const NewAppointmentStep2 = () => {
  const {
    step,
    setStep,
    newAppointmentData,
    setNewAppointmentData,
    companyDetails,
    practitioners,
    setPractitioners,
    loadMoreCompanies,
    isLoadingMoreCompanies,
    hasMoreCompanies,
    // companyPagination,
  } = useAppointmentChecker();

  // Initialize selectedDate state
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    newAppointmentData?.day ? dayjs(newAppointmentData.day) : dayjs()
  );
  const [availability, setAvailability] = useState<IAvailability[]>([]);
  const [bookings, setBookings] = useState<TGetBooking[]>([]);
  // Initialize react-hook-form with controller for complex inputs
  const {
    // register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    // setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      practitioner:
        typeof newAppointmentData?.practitioner === "object"
          ? newAppointmentData.practitioner
          : { id: "", name: "" },

      businessName:
        typeof newAppointmentData?.businessName === "object"
          ? newAppointmentData.businessName
          : { id: "", name: "" },

      time: newAppointmentData?.time ?? "",
      appointmentLength: newAppointmentData?.appointmentLength ?? "15",
      appointmentType:
        newAppointmentData?.appointmentType ?? EnBookingType.IN_PERSON,
      day: newAppointmentData?.day
        ? new Date(newAppointmentData.day)
        : new Date(),
      details: newAppointmentData?.details ?? "",
    },
  });

  const onSubmit = (data: FormValues) => {
    // Save form data to context
    //@ts-ignore
    setNewAppointmentData({
      ...newAppointmentData,
      ...data,
    });
    // Navigate to confirmation step
    setStep(step + 1);
  };

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
  // Filter times based on selected date and appointment type
  const getFilteredTimes = () => {
    const date = selectedDate;
    const appointmentType = control._formValues.appointmentType;

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
      //@ts-ignore
      return !bookings.some((booking: IGetBookingFiltered) => {
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
        // For phone call appointments, show both phone call slots and "both" type slots
        return [EnBookingType.PHONE, EnBookingType.IN_PERSON].includes(
          slot.type as EnBookingType
        );
      } else if (appointmentType === EnBookingType.IN_PERSON) {
        // For in-person appointments, only show in-person slots
        return slot.type === EnBookingType.IN_PERSON;
      }
      return false;
    });
  };

  useEffect(() => {
    getFilteredTimes();
  }, [watch("appointmentType")]);

  const handleBusinessChange = (companyId: string) => {
    const selectedCompany = companyDetails?.find(
      (company) => company.company_id == Number(companyId)
    );
    if (selectedCompany && selectedCompany.users) {
      setPractitioners(selectedCompany.users);
    } else {
      setPractitioners([]);
    }
  };

  useEffect(() => {
   
    const fetchAvailability = async () => {
      try {
        if (control._formValues.practitioner.id) {
          const availability = await getAvailability({
            user_id: Number(control._formValues.practitioner.id),
            date: selectedDate!.format("YYYY-MM-DD"),
            range: "day",
          });
          setAvailability(availability.availability);
        }
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };
    const fetchBookings = async () => {
      if (control._formValues.practitioner.id) {
        const bookings = await getBookings({
          user_id: Number(control._formValues.practitioner.id),
          date: selectedDate!.format("YYYY-MM-DD"),
          range: "day",
        });
        setBookings(bookings.bookings);
      }
    };
    fetchAvailability();
    fetchBookings();
  }, [selectedDate, watch("practitioner")]);
  // console.log(availability, "avb");
  // console.log(bookings, "bookings");

  // Function to handle scroll in business name dropdown
  const handleBusinessNameScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

      // Make the threshold more generous - load when within 50px of bottom
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;

      if (isNearBottom && hasMoreCompanies && !isLoadingMoreCompanies) {
        // console.log("Loading more companies...", {
        //   scrollTop,
        //   clientHeight,
        //   scrollHeight,
        //   distanceFromBottom: scrollHeight - scrollTop - clientHeight,
        //   hasMore: hasMoreCompanies,
        //   isLoading: isLoadingMoreCompanies,
        //   currentPage: companyPagination?.currentPage,
        // });
        loadMoreCompanies();
      }
    },
    [hasMoreCompanies, isLoadingMoreCompanies, loadMoreCompanies]
  );

  return (
    <Box>
      <Typography
        align="center"
        variant="h3"
        my={2}
        sx={{ fontSize: { xs: 24, md: 28 } }}
      >
        New Appointment <br /> Step 2
      </Typography>

      <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid size={12}>
            <Typography variant="bodyMediumExtraBold" color="grey.600">
              Business Name
            </Typography>
            <Controller
              name="businessName"
              control={control}
              render={({ field: { onChange, value, ...restField } }) => (
                <CommonTextField
                  {...restField}
                  value={value?.id || ""}
                  select
                  fullWidth
                  error={!!errors.businessName}
                  helperText={errors.businessName?.message}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    const selectedBusiness = companyDetails.find(
                      (company) => company.company_id.toString() === selectedId
                    );
                    onChange(
                      selectedBusiness
                        ? {
                            id: selectedBusiness.company_id.toString(),
                            name: selectedBusiness.company_name,
                          }
                        : null
                    );
                    handleBusinessChange(selectedId);
                  }}
                  SelectProps={{
                    displayEmpty: true,
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                          overflow: "auto",
                        },
                        onScroll: handleBusinessNameScroll,
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Select Business Name</em>
                  </MenuItem>
                  {companyDetails.map((company) => (
                    <MenuItem
                      key={company.company_id}
                      value={company.company_id.toString()}
                    >
                      {company.company_name}
                    </MenuItem>
                  ))}
                  {isLoadingMoreCompanies && (
                    <MenuItem disabled>
                      <Box
                        display="flex"
                        justifyContent="center"
                        width="100%"
                        py={1}
                      >
                        Loading more...
                      </Box>
                    </MenuItem>
                  )}
                  {!isLoadingMoreCompanies && hasMoreCompanies && (
                    <MenuItem
                      onClick={() => loadMoreCompanies()}
                      sx={{ justifyContent: "center", color: "primary.main" }}
                    >
                      Load more companies...
                    </MenuItem>
                  )}
                </CommonTextField>
              )}
            />
          </Grid>
          <Grid size={12}>
            <Box my={2}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography variant="bodyMediumExtraBold" color="grey.600">
                  Practitioner
                </Typography>
                <img src={questionMark} alt="" />
              </Box>
              <Controller
                name="practitioner"
                control={control}
                render={({ field: { onChange, value, ...restField } }) => (
                  <CommonTextField
                    {...restField}
                    value={value?.id || ""} // Ensure it binds correctly
                    onChange={(e) => {
                      const selectedId = e.target.value;
                      const selectedPractitioner = practitioners.find(
                        (practitioner) =>
                          practitioner.user_id.toString() === selectedId
                      );

                      onChange(
                        selectedPractitioner
                          ? {
                              id: selectedPractitioner.user_id.toString(),
                              name: `${selectedPractitioner.first_name} ${selectedPractitioner.last_name}`,
                            }
                          : null
                      );
                    }}
                    select
                    fullWidth
                    error={!!errors.practitioner}
                    helperText={errors.practitioner?.message}
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
                  >
                    <MenuItem value="">
                      <em>Select Practitioner</em>
                    </MenuItem>
                    {practitioners.map((practitioner) => (
                      <MenuItem
                        key={practitioner.user_id}
                        value={practitioner.user_id.toString()}
                      >
                        {practitioner.first_name} {practitioner.last_name}
                      </MenuItem>
                    ))}
                  </CommonTextField>
                )}
              />
            </Box>
          </Grid>
          <Grid size={12}>
            <Box>
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
                    <MenuItem value={EnBookingType.IN_PERSON}>
                      In Person
                    </MenuItem>
                    <MenuItem value={EnBookingType.PHONE}>Phone Call</MenuItem>
                  </CommonTextField>
                )}
              />
            </Box>
          </Grid>
          <Grid size={12}>
            <Box my={2}>
              <Typography variant="bodyMediumExtraBold" color="grey.600">
                Select Date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="day"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={selectedDate}
                      onChange={(newValue) => {
                        setSelectedDate(newValue);
                        if (newValue) {
                          const dateObj = newValue.toDate();
                          field.onChange(dateObj);
                        }
                      }}
                      slots={{ openPickerIcon: calenderIcon }}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.day,
                          helperText: errors.day?.message,
                        },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
            </Box>
          </Grid>
          <Grid size={12}>
            <Box>
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
                    {getFilteredTimes().map((timeSlot) => (
                      <MenuItem key={timeSlot.time} value={timeSlot.time}>
                        {timeSlot.time}{" "}
                        {/* {timeSlot.type === "phoneCall"
                          ? "(Phone only)"
                          : timeSlot.type === "inPerson"
                          ? "(In-person only)"
                          : ""} */}
                      </MenuItem>
                    ))}
                  </CommonTextField>
                )}
              />
            </Box>
          </Grid>

          <Grid size={12}>
            <Box my={2}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography variant="bodyMediumExtraBold" color="grey.600">
                  Appointment Length
                </Typography>
                <img src={questionMark} alt="" />
              </Box>
              <Controller
                name="appointmentLength"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    select
                    fullWidth
                    error={!!errors.appointmentLength}
                    helperText={errors.appointmentLength?.message}
                  >
                    {Object.values(EnBookingDuration).map((duration) => (
                      <MenuItem value={duration}>{duration} minutes</MenuItem>
                    ))}
                  </CommonTextField>
                )}
              />
            </Box>
          </Grid>

          <Grid size={12}>
            <Box display="flex" alignItems="center" gap={0.5}>
              <Typography variant="bodyMediumExtraBold" color="grey.600">
                Details
              </Typography>
              <img src={questionMark} alt="" />
            </Box>
            <Controller
              name="details"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  {...field}
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Add reason for appointment"
                  error={!!errors.details}
                  helperText={errors.details?.message}
                />
              )}
            />
          </Grid>
        </Grid>

        <Box my={4} display="flex" gap={2}>
          <CommonButton
            text="Back"
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => {
              // Navigate back to previous step
              setStep(step - 1);
            }}
          />
          <CommonButton
            text="Continue"
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
          >
            Continue
          </CommonButton>
        </Box>
        <Box display="flex" justifyContent="center" mt={2}>
          <StepProgress
            currentStep={step - 1}
            totalSteps={EnStepProgress.TOTAL_STEPS}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default NewAppointmentStep2;
