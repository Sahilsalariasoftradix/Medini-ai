import { Box, Typography, FormHelperText } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useAppointmentChecker } from "../../../store/AppointmentCheckerContext";
import CommonButton from "../../common/CommonButton";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import CommonTextField from "../../common/CommonTextField";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { useState } from "react";
import { calenderIcon } from "../../Booking/Form/SlotBookingForm";
import StepProgress from "../StepProgress";
import { EnStepProgress } from "../../../utils/enums";
import { MuiPhone } from "../../Auth/SignUp/CustomPhoneInput";
import CommonSnackbar from "../../common/CommonSnackbar";

// Define validation schema with zod
const validationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Invalid email format"),
  // phone: z
  //   .string()
  //   .min(1, "Phone number is required")
  //   .regex(/^\+?[0-9]{10,14}$/, "Invalid phone number format"),
  // address: z.string().optional(),
  bypass_key: z.string().optional(),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

// Create type from schema
type FormValues = z.infer<typeof validationSchema>;

const NewAppointmentStep1 = () => {
  const {
    step,
    setStep,
    setNewAppointmentData,
    newAppointmentData,
    phone,
    setPhone,
    snackbar,
    setSnackbar,
  } = useAppointmentChecker();

  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  // Initialize react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      firstName: newAppointmentData?.firstName || "",
      lastName: newAppointmentData?.lastName || "",
      email: newAppointmentData?.email || "",
      dateOfBirth: newAppointmentData?.dateOfBirth || "",
      bypass_key: newAppointmentData?.bypass_key || "",
    },
  });

  const onSubmit = (data: FormValues) => {
  
    if (!phone || phone.length < 12) {
      setSnackbar({
        open: true,
        message: "Please enter a valid phone number",
        severity: "error",
      });
      return;
    }
    // Save form data to context
    //@ts-ignore
    setNewAppointmentData({
      ...newAppointmentData,
      ...data,
      bypass_key: data.bypass_key || "",
      phone: phone,
    });
    // Navigate to next step
    setStep(step + 1);
    setFormSubmitted(true);
  };

  return (
    <Box>
      <Typography
        align="center"
        variant="h3"
        my={2}
        sx={{ fontSize: { xs: 24, md: 28 } }}
      >
        New Appointment
        <br />
        Step 1
      </Typography>

      <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid size={12}>
          <Typography variant="bodyMediumExtraBold" color="grey.600">
             First Name
            </Typography>
            <CommonTextField
              // label="Full Name"
              placeholder="First Name"
              register={register("firstName")}
              errorMessage={errors.firstName?.message}
            />
          </Grid>
          <Grid size={12}>
          <Typography variant="bodyMediumExtraBold" color="grey.600">
             Last Name
            </Typography>
            <CommonTextField
              placeholder="Last Name"
              register={register("lastName")}
              errorMessage={errors.lastName?.message}
            />
          </Grid>
          <Grid size={12}>
          <Typography variant="bodyMediumExtraBold" color="grey.600">
             Email
            </Typography>
            <CommonTextField
              placeholder="Email Address"
              register={register("email")}
              errorMessage={errors.email?.message}
            />
          </Grid>
          <Grid size={12}>
          <Typography variant="bodyMediumExtraBold" color="grey.600">
             Phone
            </Typography>
            <MuiPhone
              value={phone}
              onChange={(phone) => setPhone(phone)}
              error={formSubmitted && (!phone || phone.length < 12)}
            />
          </Grid>
          {/* <Grid size={12}>
            <Typography mt={1} color="grey.600" variant="bodyMediumExtraBold">
              Bypass key
            </Typography>
            <CommonTextField
              placeholder="Bypass key"
              register={register("bypass_key")}
              errorMessage={errors.bypass_key?.message}
            />
          </Grid>
           */}
          <Grid size={12}>
            <Typography variant="bodyMediumExtraBold" color="grey.600">
              Date of birth
            </Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    value={field.value ? dayjs(field.value) : null}
                    onChange={(newValue) => {
                      field.onChange(
                        newValue ? dayjs(newValue).format("YYYY-MM-DD") : ""
                      );
                    }}
                    maxDate={dayjs()}
                    slotProps={{
                      field: {
                        //@ts-ignore
                        fullWidth: true,
                      },
                    }}
                    slots={{ openPickerIcon: calenderIcon }}
                    label=""
                  />
                )}
              />
            </LocalizationProvider>
            <FormHelperText>{errors.dateOfBirth?.message}</FormHelperText>
          </Grid>
        </Grid>

        <Box my={4} display="flex" gap={2}>
          <CommonButton
            text="Back"
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => {
              // Navigate back to previous view
              setStep(step - 1);
            }}
          />
          <CommonButton
            text="Continue"
            variant="contained"
            color="primary"
            fullWidth
            type="submit"
          >
            Next
          </CommonButton>
        </Box>
        <Box display="flex" justifyContent="center" mt={2}>
          <StepProgress
            currentStep={step - 1}
            totalSteps={EnStepProgress.TOTAL_STEPS}
          />
        </Box>
        <CommonSnackbar
          open={snackbar.open}
          onClose={() =>
            setSnackbar({ open: false, message: "", severity: "success" })
          }
          message={snackbar.message}
          severity={snackbar.severity}
        />
      </Box>
    </Box>
  );
};

export default NewAppointmentStep1;
