import { Box, Typography, MenuItem, Grid, FormHelperText } from "@mui/material";
import questionMark from "../../../assets/icons/question.svg";
import { useAppointmentChecker } from "../../../store/AppointmentCheckerContext";
import CommonButton from "../../common/CommonButton";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { calenderIcon } from "../../Booking/Form/SlotBookingForm";
import { useState } from "react";
import CommonTextField from "../../common/CommonTextField";
import { InPersonIcon } from "../../../utils/Icons";

// Define validation schema with zod
const validationSchema = z.object({
  date: z.instanceof(Date, { message: "Date is required" }),
  time: z.instanceof(Date, { message: "Time is required" }),
  appointmentLength: z.string().min(1, "Appointment length is required"),
  appointmentType: z.string().min(1, "Appointment type is required"),
  practitioner: z.string().min(1, "Practitioner is required"),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  dateOfBirth: z.string().optional(),
  bypass_key: z.string().optional(),
});

// Create type from schema
type FormValues = z.infer<typeof validationSchema>;

const NewAppointmentStep2 = () => {
  const { step, setStep, newAppointmentData, setNewAppointmentData } =
    useAppointmentChecker();
    
  // Initialize with existing data if available
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
    newAppointmentData?.date ? dayjs(newAppointmentData.date) : null
  );
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(
    newAppointmentData?.time ? dayjs(newAppointmentData.time) : null
  );
  
  // Initialize react-hook-form with controller for complex inputs
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      practitioner: newAppointmentData?.practitioner || "",
      date: newAppointmentData?.date ? new Date(newAppointmentData.date) : undefined,
      time: newAppointmentData?.time ? new Date(newAppointmentData.time) : undefined,
      appointmentLength: newAppointmentData?.appointmentLength || "",
      appointmentType: newAppointmentData?.appointmentType || "",
    },
  });

  const onSubmit = (data: FormValues) => {
    // Save form data to context
    //@ts-ignore
    setNewAppointmentData({
      ...newAppointmentData,
      ...data,
    });
    // Navigate to confirmation step
    setStep(step + 1);
  };
  console.log(errors);
  return (
    <Box>
      <Typography
        align="center"
        variant="h3"
        my={2}
        sx={{ fontSize: { xs: 24, md: 28 } }}
      >
        New Appointment <br /> Step 2
      </Typography>

      <Box component="form" sx={{ mt: 3 }} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Box my={2}>
              <Typography variant="bodyMediumExtraBold" color="grey.600">
                Date
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      value={selectedDate}
                      onChange={(newValue) => {
                        setSelectedDate(newValue);
                        if (newValue) {
                          const dateObj = newValue.toDate();
                          field.onChange(dateObj);
                          setValue("date", dateObj, { shouldValidate: true });
                        }
                      }}
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
              <FormHelperText error>{errors.date?.message}</FormHelperText>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box my={2}>
              <Typography variant="bodyMediumExtraBold" color="grey.600">
                Time
              </Typography>
              <Controller
                name="time"
                control={control}
                render={({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      ampm={false}
                      value={selectedTime}
                      onChange={(newValue) => {
                        setSelectedTime(newValue);
                        if (newValue) {
                          const timeObj = newValue.toDate();
                          field.onChange(timeObj);
                          setValue("time", timeObj, { shouldValidate: true });
                        }
                      }}
                      format="HH:mm"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          placeholder: "Start time",
                          error: !!errors.time,
                          helperText: errors.time?.message,
                          sx: {
                            "& .MuiInputBase-input": {
                              fontSize: "12px",
                            },
                            "& .MuiInputBase-input::placeholder": {
                              fontSize: "12px",
                            },
                          },
                        },
                        actionBar: {
                          actions: ["accept"],
                        },
                      }}
                      slots={{ openPickerIcon: InPersonIcon }}
                    />
                  </LocalizationProvider>
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box my={2}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography variant="bodyMediumExtraBold" color="grey.600">
                  Appointment Type
                </Typography>
                <img src={questionMark} alt="" />
              </Box>
              <Controller
                name="appointmentType"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    select
                    fullWidth
                    error={!!errors.appointmentType}
                    helperText={errors.appointmentType?.message}
                  >
                    <MenuItem value="inPerson">In Person</MenuItem>
                    <MenuItem value="phoneCall">Phone Call</MenuItem>
                  </CommonTextField>
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box my={2}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography variant="bodyMediumExtraBold" color="grey.600">
                  Appointment Length
                </Typography>
                <img src={questionMark} alt="" />
              </Box>
              <Controller
                name="appointmentLength"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    select
                    fullWidth
                    error={!!errors.appointmentLength}
                    helperText={errors.appointmentLength?.message}
                  >
                    <MenuItem value="15">15 minutes</MenuItem>
                    <MenuItem value="30">30 minutes</MenuItem>
                    <MenuItem value="45">45 minutes</MenuItem>
                    <MenuItem value="60">60 minutes</MenuItem>
                  </CommonTextField>
                )}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box my={2}>
              <Box display="flex" alignItems="center" gap={0.5}>
                <Typography variant="bodyMediumExtraBold" color="grey.600">
                  Practitioner
                </Typography>
                <img src={questionMark} alt="" />
              </Box>
              <Controller
                name="practitioner"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    select
                    fullWidth
                    error={!!errors.practitioner}
                    helperText={errors.practitioner?.message}
                  >
                    <MenuItem value="Dr Johnny">Dr Johnny</MenuItem>
                    <MenuItem value="Dr Jane">Dr Jane</MenuItem>
                  </CommonTextField>
                )}
              />
            </Box>
          </Grid>
        </Grid>

        <Box my={4} display="flex" gap={2}>
          <CommonButton
            text="Back"
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => {
              // Navigate back to previous step
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
            Continue
          </CommonButton>
        </Box>
      </Box>
    </Box>
  );
};

export default NewAppointmentStep2;
