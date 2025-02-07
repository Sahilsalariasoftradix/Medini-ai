"use client";

import {
  Box,
  Paper,
  IconButton,
  Typography,
  Popover,
  Menu,
  MenuItem,
} from "@mui/material";
import { DaySchedule } from "../../types/calendar";
import { DayHeader } from "./day.header";
import { StatusTotals } from "./status-total";
import Grid from "@mui/material/Grid2";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import calendarIcon from "../../assets/icons/calenderIcon.svg";
import leftArrow from "../../assets/icons/left.svg";
import rightArrow from "../../assets/icons/right.svg";
import { StatusIcon } from "./status-icon";
import { EnBookings } from "../../utils/enums";

dayjs.extend(isSameOrBefore);

const generateTimeSlots = () => {
  const slots = [];
  // Generate slots from 7 AM to 9 PM
  for (let hour = 7; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      slots.push({
        time: `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`,
        status: Math.random() > 0.5 ? "active" : "available",
      });
    }
  }
  return slots;
};

const generateDaysFromRange = (
  startDate: Date | null,
  endDate: Date | null
): DaySchedule[] => {
  if (!startDate || !endDate) return [];

  const days: DaySchedule[] = [];
  let currentDate = dayjs(startDate);
  const end = dayjs(endDate);

  while (currentDate.isSameOrBefore(end)) {
    days.push({
      day: currentDate.format("ddd"),
      date: currentDate.date(),
      slots: generateTimeSlots(),
    });
    currentDate = currentDate.add(1, "day");
  }

  return days;
};

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

// const TimeSlot = ({ status }: { status: string }) => (
//   <Box
//     sx={{
//       width: "100%",
//       display: "flex",
//       alignItems: "center",
//       justifyContent: "center",
//       borderRight: "1px solid #EDF2F7",
//       //   backgroundColor: status === "active" ? "grey.50" : "transparent",
//       backgroundColor: "grey.50",
//       cursor: "pointer",
//       "&:hover": {
//         backgroundColor: "primary.light",
//       },
//     }}
//   >
//     <StatusIcon status={0} />
//   </Box>
// );
const TimeSlot = ({
  status,
  onChange,
}: {
  status: EnBookings;
  onChange: (newStatus: EnBookings) => void;
}) => {
  const [selectedStatus, setSelectedStatus] = useState<EnBookings>(status);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (newStatus?: EnBookings) => {
    if (newStatus !== undefined) {
      setSelectedStatus(newStatus);
      onChange(newStatus);
    }
    setAnchorEl(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRight: "1px solid #EDF2F7",
        backgroundColor: "grey.50",

        cursor: "pointer",
        "&:hover": {
          backgroundColor: "primary.light",
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

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleClose()}
        sx={{
          "& .MuiPaper-root": {
            backdropFilter: "blur(3px)", // Apply blur effect
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
            onClick={() => handleClose(option)}
          >
            <StatusIcon status={option} />
            <Typography variant="bodySmallSemiBold" color="grey.500">
              {EnBookings[option]}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default function AvailabilityCalendar() {
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(),
    dayjs().add(6, "day").toDate(),
  ]);
  const [startDate, endDate] = dateRange;
  const [days, setDays] = useState<DaySchedule[]>(
    generateDaysFromRange(startDate, endDate)
  );
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  // Update days when date range changes
  useEffect(() => {
    setDays(generateDaysFromRange(startDate, endDate));
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
            {/* Time labels column */}
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

            {/* Days grid */}
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
                    right: "-8px", // Half of spacing={2}
                    top: 0,
                    bottom: 0,
                    width: "1px",
                    backgroundColor: "#EDF2F7",
                  },
                },
              }}
            >
              {days.map((day) => (
                <Grid size={"grow"} key={day.day}>
                  <DayHeader
                    day={day.day}
                    date={day.date}
                    onEditAvailability={() => handleEditAvailability(day.day)}
                    onClearDay={() => handleClearDay(day.day)}
                  />
                  <Box
                    sx={{
                      height: "calc(100% - 59px)",
                      border: "1px solid #EDF2F7",
                      borderRadius: 1,
                      overflow: "hidden",
                      backgroundColor: "white",
                    }}
                  >
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
                          const slot = day.slots[slotIndex];
                          return (
                            <TimeSlot
                              key={quarterIndex}
                              onChange={(newStatus) =>
                                console.log("New status:", newStatus)
                              }
                              status={slot.status}
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
