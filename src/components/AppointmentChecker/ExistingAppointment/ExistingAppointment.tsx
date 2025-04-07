import { Box, FormHelperText, Typography } from "@mui/material";
import CommonTextField from "../../common/CommonTextField";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ExistingAppointmentSchema,
  ExistingAppointmentSchemaType,
} from "../../../store/StepFormContext";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CommonButton from "../../common/CommonButton";
import { useAppointmentChecker } from "../../../store/AppointmentCheckerContext";
import SearchInput from "../../common/SearchInput";
import { MuiPhone } from "../../Auth/SignUp/CustomPhoneInput";
import { useState } from "react";
import CommonSnackbar from "../../common/CommonSnackbar";
import { sendVerificationCode } from "../../../api/userApi";

const ExistingAppointment = () => {
  const {
    setStep,
    setExistingAppointmentData,
    step,
    existingAppointmentData,
    existingPhone,
    setExistingPhone,
    setSnackbar,
    snackbar,
    companyDetails,
    startTimer,
  } = useAppointmentChecker();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<ExistingAppointmentSchemaType>({
    resolver: zodResolver(ExistingAppointmentSchema),
    defaultValues: existingAppointmentData || {},
  });
  const onSubmit: SubmitHandler<ExistingAppointmentSchemaType> = async (
    data
  ) => {
    setLoading(true);
    if (!existingPhone || existingPhone.length < 12) {
      setSnackbar({
        open: true,
        message: "Please enter a valid phone number",
        severity: "error",
      });
      return;
    }
    setFormSubmitted(true);

    setExistingAppointmentData({
      ...data,
      phone: existingPhone,
    });
    try {
      await sendVerificationCode(existingPhone, data.email);
      setStep(step + 1);
      startTimer();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message as string,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
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

        <Box>
          <Typography variant="bodyMediumExtraBold" color="grey.600">
            Phone
          </Typography>
          <MuiPhone
            value={existingPhone}
            onChange={(phone) => setExistingPhone(phone)}
            error={
              formSubmitted && (!existingPhone || existingPhone.length < 12)
            }
          />
        </Box>
        <Box mt={2}>
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
        </Box>
        <Box>
          <Box my={2}>
            <Typography mt={1} color="grey.600" variant="bodyMediumExtraBold">
              Where is your appointment?
            </Typography>
            <Controller
              name="appointment_location"
              control={control}
              render={({ field }) => {
                const selectedOption = companyDetails?.find(
                  (company) => company.company_id === Number(field.value)
                );
                return (
                  <SearchInput
                    options={(companyDetails || []).map((company) => {
                      return {
                        title: company.company_name,
                        value: company.company_id.toString(),
                      };
                    })}
                    placeholder="Search for your appointment"
                    value={
                      selectedOption
                        ? {
                            title: selectedOption.company_name,
                            value: selectedOption.company_id.toString(),
                          }
                        : null
                    }
                    onChange={(value) => {
                      if (
                        typeof value === "object" &&
                        value !== null &&
                        "value" in value
                      ) {
                        field.onChange(value.value);
                      } else {
                        field.onChange(value);
                      }
                    }}
                  />
                );
              }}
            />
            <FormHelperText>
              {errors.appointment_location?.message}
            </FormHelperText>
          </Box>
        </Box>
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
            disabled={loading}
            color="primary"
            loading={loading}
          />
        </Box>
      </form>
      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() =>
          setSnackbar({ open: false, message: "", severity: "success" })
        }
      />
    </Box>
  );
};

export default ExistingAppointment;
