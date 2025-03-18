import React from "react";
import { Typography } from "@mui/material";
import { CalenderNameSchema, CalenderNameSchemaType, useStepForm } from "../../../store/StepFormContext";
import { staticText } from "../../../utils/staticText";
import CommonButton from "../../common/CommonButton";
import CommonTextField from "../../common/CommonTextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import StepFormLayout from "../StepFormLayout";

const NameYourCalendar: React.FC = () => {
  const {  updateUserDetails, skipNextStep } =
    useStepForm();
  // Validate hook
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CalenderNameSchemaType>({
    resolver: zodResolver(CalenderNameSchema),
  });
  const onSubmit: SubmitHandler<CalenderNameSchemaType> = async (data) => {
    updateUserDetails({ calendarName: data.calenderName });
    skipNextStep();
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
          placeholder="Calendar name..."
          register={register("calenderName")}
          errorMessage={errors.calenderName?.message}
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
