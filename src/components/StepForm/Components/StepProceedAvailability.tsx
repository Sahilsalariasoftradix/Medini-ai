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
import isBetween from "dayjs/plugin/isBetween";
import { postAvailabilityGeneral } from "../../../api/userApi";
import { ISchedule, ISelectedCell } from "../../../utils/Interfaces";
import { TScheduleKey, TScheduleTypes } from "../../../utils/types";
import {
  daysOfWeek,
  headers,
  typeMappings,
} from "../../../utils/constants/stepAvailability";
import CommonSnackbar from "../../common/CommonSnackbar";

dayjs.extend(isBetween);

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
    if (newValue && selectedCell) {
      const proposedTime = newValue.format("HH:mm:ss");
      const daySchedule = schedule[selectedCell.dayIndex];
      
      // Check for overlaps with other slot types
      const hasOverlap = TScheduleTypes.some(slotType => {
        if (slotType === selectedCell.type) return false; // Skip checking against same type
        
        const startTime = daySchedule[`${slotType}_start_time`];
        const endTime = daySchedule[`${slotType}_end_time`];
        
        // If either start or end time is missing, no overlap
        if (!startTime || !endTime) return false;
        
        const proposedTimeObj = dayjs(proposedTime, "HH:mm:ss");
        const slotStartTime = dayjs(startTime, "HH:mm:ss");
        const slotEndTime = dayjs(endTime, "HH:mm:ss");

        // For start time selection
        if (selectedCell.isStart) {
          // Allow same start time, but prevent if proposed time is between another slot's range
          return proposedTimeObj.isAfter(slotStartTime) && proposedTimeObj.isBefore(slotEndTime);
        }
        
        // For end time selection
        // Check if proposed end time overlaps with another slot's range
        const currentStartTime = daySchedule[`${selectedCell.type}_start_time`];
        if (currentStartTime) {
          const currentStartTimeObj = dayjs(currentStartTime, "HH:mm:ss");
          return (
            (proposedTimeObj.isAfter(slotStartTime) && proposedTimeObj.isBefore(slotEndTime)) ||
            (currentStartTimeObj.isBefore(slotEndTime) && proposedTimeObj.isAfter(slotStartTime))
          );
        }
        
        return false;
      });

      if (hasOverlap) {
        setSnackbar({
          open: true,
          message: "Time ranges cannot overlap. Please select a different time.",
          severity: "error",
        });
        return;
      }
  
      // For end time selection, check if it's after start time
      if (!selectedCell.isStart) {
        const startKey: TScheduleKey = `${selectedCell.type}_start_time`;
        const startTime = daySchedule[startKey];
  
        if (!startTime) {
          setSnackbar({
            open: true,
            message: "Please select a start time first.",
            severity: "error",
          });
          return;
        }
  
        if (dayjs(proposedTime, "HH:mm:ss").isBefore(dayjs(startTime, "HH:mm:ss"))) {
          setSnackbar({
            open: true,
            message: "End time cannot be earlier than start time.",
            severity: "error",
          });
          return;
        }
      }
  
      // For start time selection, check if it's before end time
      if (selectedCell.isStart) {
        const endKey: TScheduleKey = `${selectedCell.type}_end_time`;
        const endTime = daySchedule[endKey];
  
        if (endTime && dayjs(proposedTime, "HH:mm:ss").isAfter(dayjs(endTime, "HH:mm:ss"))) {
          setSnackbar({
            open: true,
            message: "Start time cannot be later than end time.",
            severity: "error",
          });
          return;
        }
      }
  
      setSelectedTime(newValue);
      setSchedule(prev => {
        const updatedSchedule = [...prev];
        const key: TScheduleKey = `${selectedCell.type}_${selectedCell.isStart ? "start" : "end"}_time`;
        updatedSchedule[selectedCell.dayIndex][key] = proposedTime;
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
                                height:'60px',
                                width:"60px",
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
