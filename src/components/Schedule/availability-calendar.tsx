import {
  Box,
  Paper,
  IconButton,
  Typography,
  Popover,
  Switch,
  Button,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { DayHeader } from "./day-header";
import Grid from "@mui/material/Grid2";
import { useState, useEffect, useCallback } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import calendarIcon from "../../assets/icons/calenderIcon.svg";
import leftArrow from "../../assets/icons/left.svg";
import rightArrow from "../../assets/icons/right.svg";
import { StatusIcon } from "./status-icon";
import { EnAvailability, EStaticID } from "../../utils/enums";
import { useAvailability } from "../../store/AvailabilityContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { IBookingResponse } from "../../utils/Interfaces";
import { getBookings } from "../../api/userApi";
import { BookingTypeIcon } from "./booking-type-icon";
import { availabilityIcons, otherIcons } from "../../utils/Icons";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CommonDialog from "../common/CommonDialog";
import SlotBookingForm from "../Booking/Form/SlotBookingForm";
// import { EnBookings } from "../../utils/enums";
import { createBooking } from "../../api/userApi";

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
  appointmentType: z.enum(["inPerson", "phoneCall"], {
    errorMap: () => ({ message: "Please select an appointment type" }),
  }),
  reasonForCall: z.string().min(1, "Reason for appointment is required"),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

export default function AvailabilityCalendar() {
  const {
    days,
    dateRange,
    setDateRange,
    generateDaysFromRange,
    handleNextWeek,
    handlePreviousWeek,
  } = useAvailability();
  const [startDate, endDate] = dateRange;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [bookings, setBookings] = useState<IBookingResponse[]>([]);
  const [Today, setToday] = useState(() => dayjs(startDate));
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  console.log(selectedTime)
  const [loading, setLoading] = useState(false);
  const [openContactSearch, setOpenContactSearch] = useState(false);
  const [options] = useState<readonly any[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  useEffect(() => {
    if (startDate) {
      setToday(dayjs(startDate));
    }
  }, [startDate]);

  useEffect(() => {
    if (startDate && endDate) {
      generateDaysFromRange(startDate, endDate);
      fetchBookings();
    }
  }, [startDate, endDate, Today]);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getBookings({
        user_id: EStaticID.ID,
        date: dayjs(Today).format("YYYY-MM-DD"),
        range: EnAvailability.DAY,
      });
      setBookings(response.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [Today]);

  const getSlots = useCallback(() => {
    const day = days.find(
      (day) => day.fullDate === dayjs(Today).format("YYYY-MM-DD")
    );
    return day?.availability?.slots || [];
  }, [days, Today]);

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

  const onSubmit = async (data: AppointmentFormData) => {
    setLoading(true);
    try {
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

      await fetchBookings();
      setOpenDialog(false);
      reset();
    } catch (error: any) {
      console.error("Failed to create appointment:", error);
    } finally {
      setLoading(false);
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
          <IconButton onClick={handlePreviousWeek}>
            <img src={leftArrow} alt="previous week" />
          </IconButton>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="bodyLargeMedium">
              {formatDateRange()}
            </Typography>
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
                    opacity: day.availability.isAvailable ? 1 : 0.7,
                    position: "relative",
                    cursor: "pointer",
                  }}
                  flexGrow={1}
                  onClick={() => setToday(dayjs(day.fullDate))}
                >
                  <DayHeader
                    isToday={day.fullDate == dayjs(Today).format("YYYY-MM-DD")}
                    day={day.day}
                    date={day.date}
                    onEditAvailability={() => handleEditAvailability(day.day)}
                    onClearDay={() => handleClearDay(day.day)}
                    isAvailable={day.availability.isAvailable}
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
                    const booking = bookings.find((booking) => {
                      return booking.start_time === `${hour.time}:00`;
                    });
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
                              <BookingTypeIcon
                                bookingType={booking ? "phone" : ""}
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
                                  backgroundColor:
                                    booking.status === "active"
                                      ? "#22C55E"
                                      : booking.status === "cancelled"
                                      ? "#FF4747"
                                      : "#FACC15",
                                }}
                              >
                                {booking?.first_name}, {booking?.last_name}
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
                                setSelectedTime(hour.time);
                                setOpenDialog(true);
                                reset({
                                  date: dayjs(Today),
                                  startTime: hour.time,
                                  length: "15",
                                  appointmentType: "inPerson",
                                  reasonForCall: "",
                                });
                              }}
                              sx={{
                                cursor: "pointer",
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
            marginBottom: "40px",
          }}
        >
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography
                variant="bodyLargeMedium"
                sx={{ fontWeight: "800", fontSize: "14px", lineHeight: "21px" }}
              >
                Confirm Appointments
              </Typography>
              <Switch />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography
                sx={{
                  border: "1px solid #E2E8F0",
                  borderRadius: "12px",
                  width: "72px",
                  height: "42px",
                  padding: "16px",
                  fontSize: "14px",
                  fontWeight: "500",
                  lineHeight: "21px",
                  color: "#A0AEC0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "start",
                }}
              >
                2
              </Typography>
              <Typography
                sx={{
                  fontSize: "14px",
                  fontWeight: "500",
                  lineHeight: "21px",
                  color: "#1A202C",
                }}
              >
                Days in advance
              </Typography>
            </Box>
          </Box>
        </Paper>
        <Paper elevation={1} sx={{ p: 2 }}>
          <Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Typography
                variant="bodyLargeMedium"
                sx={{ fontWeight: "800", fontSize: "14px", lineHeight: "21px" }}
              >
                Availability
              </Typography>
              <IconButton
                sx={{ border: "1px solid #E2E8F0", borderRadius: "12px" }}
              >
                <img src={otherIcons.dotsVertical} alt="dotsVertical" />
              </IconButton>
            </Box>

            <Box sx={{ mb: 1, display: "flex", width: "100%", gap: 0 }}>
              <Box width={"50px"}>
                {["", "M", "T", "W", "T", "F", "S", "S"].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      borderLeft: index !== 0 ? "1px solid #E2E8F0" : "",
                      borderTop: index === 1 ? "1px solid #E2E8F0" : "",
                      borderBottom: index === 7 ? "1px solid #E2E8F0" : "",
                      borderTopLeftRadius: index === 1 ? "16px" : "",
                      borderBottomLeftRadius: index === 7 ? "16px" : "",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        width: "50px",
                        height: "50px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "800",
                        lineHeight: "21px",
                        color: "#1A202C",
                      }}
                    >
                      {item}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: "flex", width: "100%" }}>
                {[
                  {
                    icon: availabilityIcons.phone,
                    name: "Phone Availability",
                    bgColor: "#EDF2F7",
                  },
                  {
                    icon: availabilityIcons.in_person,
                    name: "Inpatients",
                    bgColor: "#E8F5FF",
                  },
                  {
                    icon: availabilityIcons.break,
                    name: "Break",
                    bgColor: "#DFF1E6",
                  },
                ].map((item, itemIndex) => (
                  <div style={{ width: "100%" }}>
                    <Box
                      sx={{
                        border: "1px solid #E2E8F0",
                        borderTopLeftRadius: "16px",
                        borderTopRightRadius: "16px",
                        backgroundColor: item.bgColor,
                        height: "50px",
                        textAlign: "center",
                        gap: 1,
                      }}
                      key={itemIndex}
                    >
                      <img
                        src={item.icon}
                        alt={item.name}
                        height={"18px"}
                        width={"18px"}
                        style={{ marginTop: "5px" }}
                      />
                      <Typography
                        sx={{
                          fontSize: "8px",
                          fontWeight: "600",
                          lineHeight: "12px",
                          color: "#1A202C",
                        }}
                      >
                        {item.name}
                      </Typography>
                    </Box>

                    {["M", "T", "W", "T", "F", "S", "S"].map((item, index) => (
                      <Box
                        key={item}
                        sx={{
                          borderLeft: "1px solid #0000001A",
                          borderRight: "1px solid #0000001A",
                          borderEndEndRadius:
                            itemIndex === 2 && index === 6 ? "16px" : "",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: "10px",
                            width: "100%",
                            height: "50px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontWeight: "500",
                            lineHeight: "10px",
                            color: "#1A202C",
                            borderBottom:
                              index === 6 ? "1px solid #E2E8F0" : "",
                            borderEndEndRadius:
                              itemIndex === 2 && index === 6 ? "16px" : "",
                          }}
                        >
                          09:00 - 16:00
                        </Typography>
                      </Box>
                    ))}
                  </div>
                ))}
              </Box>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
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
        loading={loading}
        disabled={loading}
      >
        <SlotBookingForm
          control={control}
          errors={errors}
          openContactSearch={openContactSearch}
          handleClose={() => setOpenContactSearch(false)}
          handleOpen={() => setOpenContactSearch(true)}
          options={options}
          loading={{ input: false }}
          shouldDisableDate={() => false}
          selectedDate={dayjs(Today)}
        />
      </CommonDialog>
    </Box>
  );
}
