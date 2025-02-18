import { Box, Typography } from "@mui/material";
import StepFormLayout from "../StepFormLayout";
import CommonButton from "../../common/CommonButton";
import { useStepForm } from "../../../store/StepFormContext";
import { useAuthHook } from "../../../hooks/useAuth";
import img from "../../../assets/images/auth/availablity.png";
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
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";

const scheduleTypes = ["Phone Availability", "In Person", "Another Type"];

const scheduleData = [
  ["09:00", "18:00", "", "09:00", "18:00",  "",""],
  ["09:30", "18:30", "", "09:30", "18:30", "",""],
  ["09:00", "18:00", "", "09:00", "18:00", "",""],
  ["09:30", "18:30", "", "09:30", "18:30", "",""],
  ["12:30", "13:15", "", "12:30", "13:15", "",""],
  ["13:00", "13:45", "", "13:00", "13:45", "",""],
  
  
];

const headers = ["M", "T", "W", "T", "F", "S", "S"];
const ProceedAvailability = () => {
  const { navigate, isLoading, setIsLoading } = useAuthHook();
  const { userDetails, setUserDetails } = useAuth();
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const [open, setOpen] = useState(false);

  const handleTimeClick = (time: string) => {
    if (time) {
      setSelectedTime(dayjs());
      setOpen(true);
    }
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
        {/* <Box
          component="img"
          sx={{
            width: 280,
            height: 266,
          }}
          alt="The house from the offer."
          src={img}
        /> */}
   <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" alignItems="center">
        {/* Type Labels */}
        <Box display="flex" flexDirection="column" mt={5} mr={2}>
          {scheduleTypes.map((type, index) => (
            <Box key={index} height={117} sx={{border:'1px sold grey',borderRadius:'50%',background:'grey',marginRight:'-110px'}} display="flex" alignItems="center">
              <Typography variant="body1" fontWeight="bold">
                {type}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Table Container */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell key={index} align="center" sx={{ fontWeight: "bold" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {scheduleData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((time, colIndex) => (
                    <TableCell
                      key={colIndex}
                      align="center"
                      sx={{ cursor: time ? "pointer" : "default", bgcolor: time ? "#e3f2fd" : "transparent",padding:'5px' }}
                      onClick={() => handleTimeClick(time)}
                    >
                      {time || <span style={{ display: "inline-block", width: "45px", height: "45px", borderRadius: "50%", backgroundColor: "#87CEFA" }}></span>}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DateTimePicker
          label="Select Time"
          value={selectedTime}
          onChange={(newValue) => setSelectedTime(newValue)}
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
