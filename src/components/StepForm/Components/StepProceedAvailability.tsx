import { Box, Typography } from "@mui/material";
import StepFormLayout from "../StepFormLayout";
import CommonButton from "../../common/CommonButton";
import { useStepForm } from "../../../store/StepFormContext";
import { useAuthHook } from "../../../hooks/useAuth";
import img from "../../../assets/images/auth/availablity.png";
import callBooking from "../../../assets/icons/call-booking.svg";
import dinner from "../../../assets/icons/dinner.svg";
import office from "../../../assets/icons/office-booking.svg";
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
import { useState } from "react";
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

const scheduleTypes: Array<"phone" | "person" | "break"> = [
  "phone",
  "person",
  "break",
];

// Define Type for Mappings
interface ScheduleType {
  icon: string;
  bgColor: string;
}

// Mapping for Icons and Background Colors
const typeMappings: Record<"phone" | "person" | "break", ScheduleType> = {
  phone: { icon: callBooking, bgColor: "#edf2f7" }, // Light blue
  person: { icon: office, bgColor: "#e8f5ff" }, // Light green
  break: { icon: dinner, bgColor: "#dff1e6" }, // Light red/pink
};



const headers = ["M", "T", "W", "T", "F", "S", "S"];
const ProceedAvailability = () => {
  const { navigate, isLoading, setIsLoading } = useAuthHook();
  const { userDetails, setUserDetails } = useAuth();
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const [open, setOpen] = useState(false);
  const [schedule, setSchedule] = useState(
    Array(6)
      .fill(null)
      .map(() => Array(7).fill("")) // Initialize all slots as empty
  );
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  console.log(selectedRow)
  const [selectedCol, setSelectedCol] = useState<number | null>(null);
  console.log(selectedCol)

  const handleTimeClick = (rowIndex: number, colIndex: number) => {
    setSelectedRow(rowIndex);
    setSelectedCol(colIndex);
    setSelectedTime(dayjs());
    setOpen(true);
  };

  const handleTimeChange = (newValue: Dayjs | null) => {
    if (selectedRow !== null && selectedCol !== null && newValue) {
      const updatedSchedule = [...schedule];
      updatedSchedule[selectedRow][selectedCol] = newValue.format("HH:mm");
      setSchedule(updatedSchedule);
    }
    setOpen(false);
  };
  const { resetForm } = useStepForm();
  const [newOnboardingStatus, setNewOnboardingStatus] = useState(
    userDetails?.onboardingStatus
  );

  const handleContinue = async () => {
    setIsLoading(true);
    try {
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
      resetForm();
      setTimeout(() => {
        navigate(routes.dashboard.home);
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
            <Box display="flex" flexDirection="column" gap="3px" mt={7} mr={2}>
              {scheduleTypes.map((type, index) => {
                const { icon, bgColor } = typeMappings[type];
                return (
                  <Box
                    key={index}
                    height={117}
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
                  {schedule.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {row.map((time, colIndex) => (
                        <TableCell
                          key={colIndex}
                          align="center"
                          sx={{
                            cursor: "pointer",
                            borderRight:
                              colIndex === row.length - 1
                                ? "none"
                                : "1px solid #e0e0e0",
                            borderBottom:
                              rowIndex === schedule.length - 1
                                ? "none"
                                : "1px solid #e0e0e0",
                            padding: "5px",
                            width: "60px",
                            // backgroundColor: time ? "#e3f2fd" : "transparent",
                          }}
                          onClick={() => handleTimeClick(rowIndex, colIndex)}
                        >
                          {time || (
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
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          <Dialog open={open} onClose={() => setOpen(false)}>
            <TimePicker
              label="Select Time"
              value={selectedTime}
              onChange={handleTimeChange}
              ampm={false} // Use 24-hour format (optional)
            />
          </Dialog>
        </LocalizationProvider>
      </Box>
      <form>
        <Box mt={0}>
          <Box justifyContent={"center"} display={"flex"} mt={4}></Box>
          <CommonButton
            sx={{ p: 1.5, mt: 2 }}
            text={"Continue"}
            loading={isLoading}
            onClick={handleContinue}
            fullWidth
            type="button"
          />
        </Box>
      </form>
    </StepFormLayout>
  );
};

export default ProceedAvailability;
