import React, { useState } from "react";
import StepFormLayout from "../StepFormLayout";
import { Box, Typography } from "@mui/material";
import { useStepForm } from "../../../store/StepFormContext";
import CommonButton from "../../common/CommonButton";
import { RoundCheckbox } from "../../common/RoundCheckbox";
import {
  EnOnboardingStatus,
  EnUserBookingsOptions,
} from "../../../utils/enums";
import { useAuthHook } from "../../../hooks/useAuth";
import {
  getCurrentUserId,
  updateUserDetailsInFirestore,
} from "../../../firebase/AuthService";
import {
  errorSavingUserDetailsMessage,
  userNotSignedInErrorMessage,
} from "../../../utils/errorHandler";

const HandleBookings = () => {
  const { userDetails, updateUserDetails, goToNextStep,companyId } = useStepForm();
  const { isLoading, setIsLoading } = useAuthHook();
  const [bookingType, setBookingType] = useState(EnUserBookingsOptions.MANUAL);
  const handleChangeCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = +e.currentTarget.value;
    setBookingType(value);
    updateUserDetails({
      ...userDetails,
      handleBookings: value,
      onboardingStatus: EnOnboardingStatus.STATUS_1,
    });
  };
  const handleContinue = async () => {
    setIsLoading(true);
    try {
      // Step 1: Get the current user ID
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error(userNotSignedInErrorMessage);
      }
      await updateUserDetailsInFirestore(userId, userDetails,companyId!);
      // console.log("User details saved successfully!");
      setTimeout(() => {
        goToNextStep();
      }, 1000);
    } catch (error) {
      console.error(errorSavingUserDetailsMessage, error);
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <StepFormLayout>
      <Typography align="center" variant="h3">
        How would you like to handle bookings?
      </Typography>
      <Typography
        align="center"
        variant="bodyLargeRegular"
        sx={{ my: 1 }}
        color="grey.600"
      >
        Require your approval with a confirmation text sent to the user, or
        automatically confirm all bookings.
      </Typography>

      <form>
        <Box mt={4}>
          <Box justifyContent={"center"} display={"flex"} mt={4}>
            <RoundCheckbox
              iconSize={24}
              checkedIconSize={24}
              labelPlacement={"bottom"}
              label="Manual"
              checked={bookingType === EnUserBookingsOptions.MANUAL}
              value={EnUserBookingsOptions.MANUAL}
              onChange={handleChangeCheckbox}
            />
            <RoundCheckbox
              iconSize={24}
              checkedIconSize={24}
              labelPlacement={"bottom"}
              label="Auto Book"
              checked={bookingType === EnUserBookingsOptions.AUTO}
              value={EnUserBookingsOptions.AUTO}
              onChange={handleChangeCheckbox}
            />
          </Box>
          <CommonButton
            sx={{ p: 1.5, mt: 4 }}
            loading={isLoading}
            text={"Continue"}
            onClick={handleContinue}
            fullWidth
          />
        </Box>
      </form>
    </StepFormLayout>
  );
};

export default HandleBookings;
