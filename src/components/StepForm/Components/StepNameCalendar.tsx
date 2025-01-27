import React from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useStepForm } from "../../../store/StepFormContext";
import { staticText } from "../../../utils/staticText";
import CommonButton from "../../common/CommonButton";
import CommonTextField from "../../common/CommonTextField";

const NameYourCalendar: React.FC = () => {
  const { userDetails, updateUserDetails, goToNextStep, goToPreviousStep } =
    useStepForm();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateUserDetails({ calendarName: event.target.value });
  };

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={"calc(100vh - 134px)"}
    >
      <Box sx={{ p: "40px", m: "auto" }} className="auth-form">
        <Typography variant="h3" align="center" mb={2}>
          {staticText.auth.nameYourCalenderText}
        </Typography>
        <Typography
          variant="bodyLargeMedium"
          mb={4}
          color="grey.600"
          align="center"
        >
          {" "}
          {staticText.auth.nameYourCalenderDescription}
        </Typography>
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <CommonTextField placeholder="Enter Email" type="email" />
        <CommonButton
          text={staticText.auth.stepContinueText}
          sx={{ mt: 5 }}
          onClick={goToNextStep}
          fullWidth
        />
         {/* <Button variant="contained" onClick={goToPreviousStep} sx={{ mr: 2 }}>
          Back
        </Button> */}
      
        {/* </form> */}
      </Box>
    </Box>
  );
};

export default NameYourCalendar;
