import {
  Box,
  Paper,
  IconButton,
  Typography,
  Popover,
  Menu,
  MenuItem,
  Autocomplete,
  CircularProgress,
  TextField,
  InputAdornment,
  Divider,
} from "@mui/material";
import { DayHeader } from "./day-header";
import { StatusTotals } from "./status-total";
import Grid from "@mui/material/Grid2";
import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import calendarIcon from "../../assets/icons/calenderIcon.svg";
import leftArrow from "../../assets/icons/left.svg";
import rightArrow from "../../assets/icons/right.svg";
import { StatusIcon } from "./status-icon";
import { EnBookings } from "../../utils/enums";
import { useAvailability } from "../../store/AvailabilityContext";
import questionMark from "../../assets/icons/question.svg";
import CommonTextField from "../common/CommonTextField";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Dayjs } from "dayjs";
import { topFilms } from "../../utils/staticText";
import CommonDialog from "../common/CommonDialog";
import SearchInput from "../common/SearchInput";
import DateInput from "../common/DateInput";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

dayjs.extend(isSameOrBefore);
interface Film {
  title: string;
  year: number;
}

function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1000);
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
  contact: z.string().min(1, "Contact is required"),
  date: z.any(), // We'll validate this separately since it's a Dayjs object
  startTime: z.string(),
  length: z.string().min(1, "Appointment length is required"),
  appointmentType: z.enum(["inPerson", "phoneCall"], {
    errorMap: () => ({ message: "Please select an appointment type" }),
  }),
  reason: z.string().min(1, "Reason for appointment is required"),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

const TimeSlot = ({
  status,
  onChange,
  disabled,
  time,
  date,
  availableDates,
}: {
  status: EnBookings;
  onChange: (newStatus: EnBookings) => void;
  disabled?: boolean;
  time: string;
  date: Date;
  availableDates: Date[];
}) => {
  const [selectedStatus, setSelectedStatus] = useState<EnBookings>(status);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs(date));
  // Search contact inputs
  const [openContactSearch, setOpenContactSearch] = useState(false);
  const [options, setOptions] = useState<readonly Film[]>([]);
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      contact: "",
      date: selectedDate,
      startTime: time,
      length: "15",
      appointmentType: "inPerson",
      reason: "",
    },
  });

  const handleOpen = () => {
    setOpenContactSearch(true);
    (async () => {
      setLoading(true);
      await sleep(1e3); // For demo purposes.
      setLoading(false);

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
    if (status === EnBookings.Available) {
      setOpenDialog(true);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const onSubmit = (data: AppointmentFormData) => {
    console.log("Form data:", data);
    setSelectedStatus(EnBookings.Unconfirmed);
    onChange(EnBookings.Unconfirmed);
    setOpenDialog(false);
    reset();
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
          cursor: disabled ? "not-allowed" : "pointer",
          "&:hover": {
            backgroundColor: disabled ? "grey.100" : "primary.light",
          },
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
          <StatusIcon handleClick={handleClick} status={selectedStatus} />
        </Box>
      </Box>
      <CommonDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          reset();
        }}
        title="New Appointment"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={handleSubmit(onSubmit)}
      >
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="bodyMediumExtraBold" color="grey.600">
            Contact
          </Typography>
          <Controller
            name="contact"
            control={control}
            render={({ field }) => (
              <SearchInput
                {...field}
                open={openContactSearch}
                onOpen={handleOpen}
                onClose={handleClose}
                options={options}
                loading={loading}
                placeholder="Search contacts..."
                error={!!errors.contact}
                helperText={errors.contact?.message}
              />
            )}
          />
          <Typography variant="bodyMediumExtraBold" color="grey.600">
            Date
          </Typography>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <DateInput
                {...field}
                label=""
                shouldDisableDate={shouldDisableDate}
                error={!!errors.date || shouldDisableDate(selectedDate)}
                helperText={
                  errors.date?.message ||
                  (shouldDisableDate(selectedDate) ? "Date not available" : "")
                }
              />
            )}
          />
          <Typography variant="bodyMediumExtraBold" color="grey.600">
            Start Time
          </Typography>
          <Controller
            name="startTime"
            control={control}
            render={({ field }) => (
              <CommonTextField {...field} fullWidth disabled />
            )}
          />
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="bodyMediumExtraBold" color="grey.600">
              Length
            </Typography>
            <img src={questionMark} alt="" />
          </Box>
          <Controller
            name="length"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                select
                fullWidth
                error={!!errors.length}
                helperText={errors.length?.message}
              >
                <MenuItem value="15">15 minutes</MenuItem>
                <MenuItem value="30">30 minutes</MenuItem>
                <MenuItem value="45">45 minutes</MenuItem>
                <MenuItem value="60">60 minutes</MenuItem>
              </CommonTextField>
            )}
          />
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
                <MenuItem value="inPerson">In Person</MenuItem>
                <MenuItem value="phoneCall">Phone Call</MenuItem>
              </CommonTextField>
            )}
          />
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="bodyMediumExtraBold" color="grey.600">
              Reason for Call
            </Typography>
            <img src={questionMark} alt="" />
          </Box>
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                fullWidth
                multiline
                rows={3}
                placeholder="Add reason for call"
                error={!!errors.reason}
                helperText={errors.reason?.message}
              />
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
        {[
          EnBookings.Available,
          EnBookings.Active,
          EnBookings.Cancelled,
          EnBookings.Unconfirmed,
        ].map((option) => (
          <MenuItem
            sx={{ justifyContent: "start", gap: 2 }}
            key={option}
            onClick={() => {
              setSelectedStatus(option);
              setAnchorEl(null);
            }}
          >
            <StatusIcon status={option} />
            <Typography variant="bodySmallSemiBold" color="grey.500">
              {EnBookings[option]}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
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
  } = useAvailability();
  const [startDate, endDate] = dateRange;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  useEffect(() => {
    generateDaysFromRange(startDate, endDate);
  }, [startDate, endDate]);

  const handleEditAvailability = (day: string) => {
    console.log(`Editing availability for ${day}`);
  };

  const handleClearDay = (day: string) => {
    console.log(`Clearing ${day}`);
  };

  const handlePreviousWeek = () => {
    setDateRange([
      dayjs(startDate).subtract(7, "day").toDate(),
      dayjs(endDate).subtract(7, "day").toDate(),
    ]);
  };

  const handleNextWeek = () => {
    setDateRange([
      dayjs(startDate).add(7, "day").toDate(),
      dayjs(endDate).add(7, "day").toDate(),
    ]);
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
            sx={{ height: "calc(100vh - 350px)", overflowY: "auto" }}
          >
            <Box sx={{ minWidth: "80px" }}>
              <Box sx={{ height: "83px" }} />
              <Box>
                {Array.from({ length: 15 }, (_, i) => i + 7).map((hour) => (
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
                ))}
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
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      ></Box>
                    )}
                    <TimeLabels />
                    {Array.from({ length: 15 }, (_, hourIndex) => (
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
                          const slotIndex = hourIndex * 4 + quarterIndex;
                          const slot = day.availability.slots[slotIndex];
                          return (
                            <TimeSlot
                              key={quarterIndex}
                              onChange={(newStatus) =>
                                updateSlotStatus(dayIndex, slotIndex, newStatus)
                              }
                              status={slot.status}
                              disabled={!day.availability.isAvailable}
                              time={slot.time}
                              date={dayjs(startDate)
                                .add(dayIndex, "day")
                                .toDate()}
                              availableDates={days
                                .filter((d) => d.availability.isAvailable)
                                .map((d, i) =>
                                  dayjs(startDate).add(i, "day").toDate()
                                )}
                            />
                          );
                        })}
                      </Box>
                    ))}
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
                  active: 3,
                  cancelled: 2,
                  unconfirmed: 1,
                  available: 12,
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
