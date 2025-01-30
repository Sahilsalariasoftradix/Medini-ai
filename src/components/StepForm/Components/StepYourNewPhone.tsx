import React from "react";
import StepFormLayout from "../StepFormLayout";
import { Box, Typography } from "@mui/material";
import { RoundCheckbox } from "../../common/RoundCheckbox";
import CommonButton from "../../common/CommonButton";
import { useStepForm } from "../../../store/StepFormContext";

const YourNewPhone = () => {
  const {

    goToNextStep,
  } = useStepForm();
  return (
    <StepFormLayout>
      <Typography align="center" variant="h3">
        Your new phone #
      </Typography>
      <Typography
        align="center"
        variant="bodyLargeRegular"
        sx={{ my: 1 }}
        color="grey.600"
      >
        This is your new phone number for patient bookings.
      </Typography>
      <Typography align="center" variant="h3">
        1-653-299-1452
      </Typography>
      <Typography
        align="center"
        variant="bodyLargeRegular"
        sx={{ my: 1 }}
        color="grey.600"
      >
             Share this with your patients to start receiving calls.
      </Typography>


      <form>
        <Box mt={0}>
          <Box justifyContent={"center"} display={"flex"} mt={4}></Box>
          <CommonButton
            sx={{ p: 1.5, mt: 2 }}
            text={"Continue"}
            onClick={goToNextStep}
            fullWidth
          />
        </Box>
      </form>
    </StepFormLayout>
  );
};

export default YourNewPhone;
