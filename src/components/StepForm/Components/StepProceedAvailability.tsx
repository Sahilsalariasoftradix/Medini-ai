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

const ProceedAvailability = () => {
  const { navigate, isLoading, setIsLoading } = useAuthHook();

  const handleContinue = async () => {
    setIsLoading(true);
    try {
      // Step 1: Get the current user ID
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error(userNotSignedInErrorMessage);
      }
      await updateUserDetailsInFirestore(userId, {
        onboardingStatus: EnOnboardingStatus.STATUS_2,
      });
      navigate(routes.dashboard.home)
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(errorSavingUserDetailsMessage, error);
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
      <Box display={'flex'} justifyContent={'center'} my={5}>
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
          />
        </Box>
      </form>
    </StepFormLayout>
  );
};

export default ProceedAvailability;
