import React from "react";
import { Box, Typography } from "@mui/material";
import { useStepForm } from "../../../store/StepFormContext";
import { staticText } from "../../../utils/staticText";
import CommonButton from "../../common/CommonButton";
import CommonTextField from "../../common/CommonTextField";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
} from "../../../hooks/useAuth";
import { SubmitHandler, useForm } from "react-hook-form";
import StepFormLayout from "../StepFormLayout";

const NameYourCalendar: React.FC = () => {
  const { userDetails, updateUserDetails, goToNextStep, goToPreviousStep } =
    useStepForm();
  // Validate hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
  });
  const onSubmit: SubmitHandler<ResetPasswordSchemaType> = async (data) => {
    updateUserDetails({ calendarName: data.email });
    goToNextStep();
  };

  return (
    <StepFormLayout>
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <CommonTextField
          placeholder="Enter Email"
          register={register("email")}
          errorMessage={errors.email?.message}
          type="email"
        />
        <CommonButton
          text={staticText.auth.stepContinueText}
          sx={{ mt: 5 }}
          type="submit"
          fullWidth
        />
        {/* <Button variant="contained" onClick={goToPreviousStep} sx={{ mr: 2 }}>
          Back
        </Button> */}
      </form>
    </StepFormLayout>
  );
};

export default NameYourCalendar;
