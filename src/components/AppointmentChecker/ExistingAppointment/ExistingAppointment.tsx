import { Box, Typography } from "@mui/material";
import CommonTextField from "../../common/CommonTextField";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ExistingAppointmentSchema,
  ExistingAppointmentSchemaType,
} from "../../../store/StepFormContext";
import { SubmitHandler, useForm } from "react-hook-form";
import CommonButton from "../../common/CommonButton";
import { useAppointmentChecker } from "../../../store/AppointmentCheckerContext";

const ExistingAppointment = () => {
  const { setStep, setExistingAppointmentData, step, existingAppointmentData } =
    useAppointmentChecker();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExistingAppointmentSchemaType>({
    resolver: zodResolver(ExistingAppointmentSchema),
    defaultValues: existingAppointmentData || {},
  });
  const onSubmit: SubmitHandler<ExistingAppointmentSchemaType> = async (
    data
  ) => {
    console.log(data);
    setExistingAppointmentData(data);
    setStep(step + 1);
  };
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography
          align="center"
          variant="h3"
          my={2}
          sx={{ fontSize: { xs: 24, md: 28 } }}
        >
          Existing Appointment
        </Typography>
        <Typography
          align="center"
          variant="bodyLargeMedium"
          sx={{ mb: 5 }}
          color="grey.600"
        >
          Let's quickly find your appointment. Please verify your personal info
          to help us find it!
        </Typography>
        <Typography mb={1} variant="bodyMediumExtraBold" color="grey.600">
          Phone
        </Typography>
        <CommonTextField
          placeholder="Phone"
          type="text"
          sx={{ mb: 5 }}
          register={register("phone")}
          error={!!errors?.phone}
          helperText={errors?.phone?.message}
        />
        <Typography mb={1} variant="bodyMediumExtraBold" color="grey.600">
          Email
        </Typography>
        <CommonTextField
          placeholder="Email"
          type="email"
          register={register("email")}
          error={!!errors?.email}
          helperText={errors?.email?.message}
        />
        <Box display={"flex"} gap={2} pt={5} pb={3}>
          <CommonButton
            fullWidth
            text="Back"
            variant="contained"
            color="secondary"
            onClick={() => setStep(step - 1)}
          />
          <CommonButton
            type="submit"
            text="Retrieve"
            fullWidth
            variant="contained"
            color="primary"
          />
        </Box>
      </form>
    </Box>
  );
};

export default ExistingAppointment;
