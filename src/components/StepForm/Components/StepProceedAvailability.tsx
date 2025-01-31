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

const ProceedAvailability = () => {
  const { navigate, isLoading, setIsLoading } = useAuthHook();
  const { userDetails, setUserDetails } = useAuth();
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
        <Box
          component="img"
          sx={{
            width: 280,
            height: 266,
          }}
          alt="The house from the offer."
          src={img}
        />
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
