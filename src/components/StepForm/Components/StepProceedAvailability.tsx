import { Box, Typography } from "@mui/material";
import StepFormLayout from "../StepFormLayout";
import CommonButton from "../../common/CommonButton";
import { useStepForm } from "../../../store/StepFormContext";
import { useAuthHook } from "../../../hooks/useAuth";
import { TimePicker } from "@mui/x-date-pickers";
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
import {  useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { postAvailabilityGeneral } from "../../../api/userApi";
import { ISchedule, ISelectedCell } from "../../../utils/Interfaces";
import { TScheduleKey, TScheduleTypes } from "../../../utils/types";
import {
  daysOfWeek,
  headers,
  typeMappings,
} from "../../../utils/constants/stepAvailability";
import CommonSnackbar from "../../common/CommonSnackbar";

const ProceedAvailability = () => {
  // Hooks
  const { navigate, isLoading, setIsLoading } = useAuthHook();
  const [selectedCell, setSelectedCell] = useState<ISelectedCell | null>(null);
  const { userDetails, setUserDetails } = useAuth();
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const [open, setOpen] = useState(false);
  const { resetForm } = useStepForm();

  const [onboardingStatus, setNewOnboardingStatus] = useState(
    userDetails?.onboardingStatus
  );
  console.log(onboardingStatus)
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

  // Storing selected schedule
  const [schedule, setSchedule] = useState<ISchedule[]>(
    daysOfWeek.map((day) => ({
      day_of_week: day,
      phone_start_time: "",
      phone_end_time: "",
      in_person_start_time: "",
      in_person_end_time: "",
      break_start_time: "",
      break_end_time: "",
    }))
  );

  // Manage time selection opening
  const handleTimeClick = (
    dayIndex: number,
    type: "phone" | "in_person" | "break",
    isStart: boolean
  ) => {
    setSelectedCell({ dayIndex, type, isStart });
    setSelectedTime(null);
    setOpen(true);
  };

  // Handle time selecting and changing and time slot selecting checks
  const handleTimeChange = (newValue: Dayjs | null) => {
    if (newValue) {
      setSelectedTime(newValue);
    }
    if (selectedCell && newValue) {
      setSchedule((prev) => {
        const updatedSchedule = [...prev];
        const key: TScheduleKey = `${selectedCell.type}_${
          selectedCell.isStart ? "start" : "end"
        }_time`;

        if (!selectedCell.isStart) {
          const startKey: TScheduleKey = `${selectedCell.type}_start_time`;
          const startTime = updatedSchedule[selectedCell.dayIndex][startKey];

          if (!startTime) {
            setSnackbar({
              open: true,
              message: "Please select a start time first.",
              severity: "error",
            });
            return prev;
          }
          if (
            dayjs(newValue.format("HH:mm:ss"), "HH:mm:ss").isBefore(
              dayjs(startTime, "HH:mm:ss")
            )
          ) {
            setSnackbar({
              open: true,
              message: "End time cannot be earlier than start time.",
              severity: "error",
            });
            return prev;
          }
        }
        updatedSchedule[selectedCell.dayIndex][key] =
          newValue.format("HH:mm:ss");
        return updatedSchedule;
      });
    }
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
      // Check if at least one time slot is selected
      const hasSelectedSlot = schedule.some((day) =>
        TScheduleTypes.some(
          (type) => day[`${type}_start_time`] || day[`${type}_end_time`]
        )
      );

      if (!hasSelectedSlot) {
        setSnackbar({
          open: true,
          message: "Please select at least one availability slot.",
          severity: "error",
        });
        setIsLoading(false);
        return;
      }
      // Check if all selected start times have corresponding end times
      const hasIncompleteEntries = schedule.some((day) =>
        TScheduleTypes.some(
          (type) => day[`${type}_start_time`] && !day[`${type}_end_time`]
        )
      );

      if (hasIncompleteEntries) {
        setSnackbar({
          open: true,
          message: "Please select an end time for all start times.",
          severity: "error",
        });
        setIsLoading(false);
        return;
      }

      // Step 1: Get the current user ID
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error(userNotSignedInErrorMessage);
      }

      const updatedStatus = EnOnboardingStatus.STATUS_2; // Store the new value

      setNewOnboardingStatus(updatedStatus); // Update state

      // Step 2: Update Firestore with the new status
      await updateUserDetailsInFirestore(userId, {
        onboardingStatus: updatedStatus, // Use updatedStatus directly
      });
      setUserDetails({ ...userDetails, onboardingStatus: updatedStatus });

      // Sending data to the API
      const payload = { user_id: 1, availabilities: schedule };
      await postAvailabilityGeneral(payload);
      // Resetting form after successful submission
      resetForm();
      setTimeout(() => {
        navigate(routes.sidebar.bookings.link);
      }, 2000);
    } catch (error) {
      console.error(errorSavingUserDetailsMessage, error);
    } finally {
      setIsLoading(false);
    }
  };

  
  return (
    <StepFormLayout>
      <Typography align="center" variant="h3">
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
      <Box display={"flex"} justifyContent={"center"} my={5}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box display="flex" alignItems="center">
            {/* Type Labels */}
            <Box display="flex" flexDirection="column" gap="3px" mt={5} mr={2}>
              {TScheduleTypes.map((type, index) => {
                const { icon, bgColor } = typeMappings[type];
                return (
                  <Box
                    key={index}
                    height={127}
                    width={117}
                    sx={{
                      border: "1px solid #e2e8f0",
                      borderRadius: "50%",
                      background: bgColor,
                      marginRight: "-96px",
                    }}
                    display="flex"
                    alignItems="center"
                  >
                    <Box
                      component="img"
                      sx={{
                        height: 21,
                        width: 21,
                        marginLeft: "10px",
                      }}
                      alt={`${type} icon`}
                      src={icon}
                    />
                  </Box>
                );
              })}
            </Box>

            {/* Table Container */}
            <TableContainer
              component={Paper}
              sx={{
                border: "1px solid #e0e0e0",
                paddingTop: "0",
                borderRadius: "16px",
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    {headers.map((header, index) => (
                      <TableCell
                        key={index}
                        align="center"
                        sx={{ fontWeight: "bold", border: 0 }}
                      >
                        {header}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {TScheduleTypes.flatMap((type) =>
                    ["start", "end"].map((timeType, rowIndex) => (
                      <TableRow key={`${type}-${timeType}`}>
                        {daysOfWeek.map((_, colIndex) => {
                          // To display time in HH:MM format in the frontend
                          const key =
                            `${type}_${timeType}_time` as keyof ISchedule;
                          return (
                            <TableCell
                              key={colIndex}
                              align="center"
                              sx={{
                                cursor: "pointer",
                                borderRight:
                                  colIndex === daysOfWeek.length - 1
                                    ? "none"
                                    : "1px solid #e0e0e0",
                                borderBottom:
                                  rowIndex === schedule.length - 1
                                    ? "none"
                                    : "1px solid #e0e0e0",
                                padding: "5px",
                                width: "60px",
                              }}
                              onClick={() =>
                                handleTimeClick(
                                  colIndex,
                                  type,
                                  timeType === "start"
                                )
                              }
                            >
                              {/* Display time otherwise lightblue circle */}
                              {(schedule[colIndex][key] &&
                                dayjs(
                                  schedule[colIndex][key],
                                  "HH:mm:ss"
                                ).format("HH:mm")) || (
                                <span
                                  style={{
                                    display: "inline-block",
                                    width: "50px",
                                    height: "50px",
                                    borderRadius: "50%",
                                    backgroundColor: "#e8f5ff",
                                  }}
                                ></span>
                              )}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Dialog 
            open={open} 
            onClose={() => setOpen(false)}
          >
            <TimePicker
              label="Select Time"
              value={selectedTime}
              onChange={handleTimeChange}
              ampm={false}
              closeOnSelect={false}
              slotProps={{
                actionBar: {
                  actions: ['accept'],
                  onAccept: () => {
                    // Check for overlapping times here
                    if (selectedCell) {
                      const conflictingType = selectedCell.type === "phone" ? "in_person" : "phone";
                      const conflictingStartTime = schedule[selectedCell.dayIndex][`${conflictingType}_start_time`];

                      if (conflictingStartTime && dayjs(selectedTime?.format("HH:mm:ss"), "HH:mm:ss").isBefore(dayjs(conflictingStartTime, "HH:mm:ss").add(1, 'minute'))) {
                        setSnackbar({
                          open: true,
                          message: `The ${conflictingType} start time cannot overlap with the phone start time.`,
                          severity: "error",
                        });
                        return;
                      }
                    }
                    // If no overlap, update the schedule
                    handleTimeChange(selectedTime);
                    setOpen(false);
                  }
                },
                textField: {
                  fullWidth: true,
                  inputProps: { readOnly: true }, // Prevent manual entry
                  onClick: () => setOpen(true), // Open time picker on click
                }
              }}
            />
          </Dialog>
        </LocalizationProvider>
      </Box>
      <form>
        <Box mt={0}>
          <Box justifyContent={"center"} display={"flex"} >

          <CommonButton
            sx={{ p: 1.5, mt: 2,width:'60%' }}
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
