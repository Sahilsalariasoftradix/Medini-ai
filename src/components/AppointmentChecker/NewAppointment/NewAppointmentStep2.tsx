import { Box, Typography, MenuItem } from "@mui/material";
import questionMark from "../../../assets/icons/question.svg";
import { useAppointmentChecker } from "../../../store/AppointmentCheckerContext";
import CommonButton from "../../common/CommonButton";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Grid from "@mui/material/Grid2";
import * as z from "zod";
import CommonTextField from "../../common/CommonTextField";
import { EnStepProgress } from "../../../utils/enums";
import StepProgress from "../StepProgress";

// Define validation schema with zod
const validationSchema = z.object({
  businessName: z.string().min(1, "Business name is required"),
  // date: z.instanceof(Date, { message: "Date is required" }),
  // time: z.instanceof(Date, { message: "Time is required" }),
  time: z.string().min(1, "Time is required"),
  appointmentLength: z.string().min(1, "Appointment length is required"),
  appointmentType: z.string().min(1, "Appointment type is required"),
  practitioner: z.string().min(1, "Practitioner is required"),
  day: z.string().min(1, "Day is required"),
});

// Create type from schema
type FormValues = z.infer<typeof validationSchema>;

const NewAppointmentStep2 = () => {
  const { step, setStep, newAppointmentData, setNewAppointmentData } =
    useAppointmentChecker();

  // Initialize with existing data if available
  // const [selectedDate, setSelectedDate] = useState<Dayjs | null>(
  //   newAppointmentData?.date ? dayjs(newAppointmentData.date) : null
  // );
  // const [selectedTime, setSelectedTime] = useState<Dayjs | null>(
  //   newAppointmentData?.time ? dayjs(newAppointmentData.time) : null
  // );

  // Initialize react-hook-form with controller for complex inputs
  const {
    // register,
    handleSubmit,
    control,
    formState: { errors },
    // setValue,
  } = useForm<FormValues>({
    resolver: zodResolver(validationSchema),
    defaultValues: {
      practitioner: newAppointmentData?.practitioner ?? "Dr Johnny",
      // date: newAppointmentData?.date
      //   ? new Date(newAppointmentData.date)
      //   : undefined,
      // time: newAppointmentData?.time
      //   ? new Date(newAppointmentData.time)
      //   : undefined,
      time: newAppointmentData?.time ?? "10:00",
      appointmentLength: newAppointmentData?.appointmentLength ?? "15",
      appointmentType: newAppointmentData?.appointmentType ?? "inPerson",
      businessName: newAppointmentData?.businessName ?? "Business Name 1",
      day: newAppointmentData?.day ?? "Monday",
    },
  });
  console.log(errors);

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

  // Static data for available times based on day
  const availableTimesByDay = {
    Monday: [
      { time: "09:00", type: "inPerson" },
      { time: "10:00", type: "both" },
      { time: "11:00", type: "phoneCall" },
      { time: "14:00", type: "inPerson" },
      { time: "15:30", type: "both" },
    ],
    Tuesday: [
      { time: "10:00", type: "phoneCall" },
      { time: "11:30", type: "both" },
      { time: "13:00", type: "inPerson" },
      { time: "16:00", type: "inPerson" },
    ],
    Wednesday: [
      { time: "09:30", type: "both" },
      { time: "11:00", type: "phoneCall" },
      { time: "14:00", type: "inPerson" },
      { time: "17:00", type: "both" },
    ],
    Thursday: [
      { time: "10:00", type: "inPerson" },
      { time: "12:30", type: "both" },
      { time: "15:00", type: "phoneCall" },
      { time: "16:30", type: "inPerson" },
    ],
    Friday: [
      { time: "09:00", type: "both" },
      { time: "11:00", type: "inPerson" },
      { time: "13:30", type: "phoneCall" },
      { time: "16:00", type: "both" },
    ],
    Saturday: [
      { time: "10:00", type: "inPerson" },
      { time: "11:30", type: "phoneCall" },
    ],
    Sunday: [
      { time: "11:00", type: "phoneCall" },
      { time: "12:00", type: "both" },
    ],
  };

  // Filter times based on selected day and appointment type
  const getFilteredTimes = () => {
    const day = control._formValues.day;
    const appointmentType = control._formValues.appointmentType;

    if (!day || !appointmentType) return [];

    const timesForDay =
      availableTimesByDay[day as keyof typeof availableTimesByDay] || [];

    return timesForDay.filter((slot: { time: string; type: string }) => {
      if (appointmentType === "phoneCall") {
        // For phone calls, show all times
        return true;
      } else if (appointmentType === "inPerson") {
        // For in-person, only show in-person times
        return ["inPerson", "both"].includes(slot.type);
      }
      return false;
    });
  };

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
        <Grid container>
          <Grid size={12}>
            <Typography variant="bodyMediumExtraBold" color="grey.600">
              Business Name
            </Typography>
            <Controller
              name="businessName"
              control={control}
              render={({ field }) => (
                <CommonTextField
                  {...field}
                  select
                  defaultValue={"Business Name 1"}
                  fullWidth
                  error={!!errors.businessName}
                  helperText={errors.businessName?.message}
                >
                  <MenuItem value="Business Name 1">Business Name 1</MenuItem>
                  <MenuItem value="Business Name 2">Business Name 2 </MenuItem>
                </CommonTextField>
              )}
            />
          </Grid>
          <Grid size={12}>
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
                    <MenuItem value="Dr Heisenberg">Dr Heisenberg</MenuItem>
                    <MenuItem value="Dr Tuco Salamanca">
                      Dr Tuco Salamanca
                    </MenuItem>
                  </CommonTextField>
                )}
              />
            </Box>
          </Grid>
          <Grid size={12}>
            <Box>
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
          <Grid size={12}>
            <Box my={2}>
              <Typography variant="bodyMediumExtraBold" color="grey.600">
                Choose Day
              </Typography>
              <Controller
                name="day"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    select
                    defaultValue={"Monday"}
                    fullWidth
                    error={!!errors.day}
                    helperText={errors.day?.message}
                  >
                    <MenuItem value="Monday">Monday</MenuItem>
                    <MenuItem value="Tuesday">Tuesday</MenuItem>
                    <MenuItem value="Wednesday">Wednesday</MenuItem>
                    <MenuItem value="Thursday">Thursday</MenuItem>
                    <MenuItem value="Friday">Friday</MenuItem>
                    <MenuItem value="Saturday">Saturday</MenuItem>
                    <MenuItem value="Sunday">Sunday</MenuItem>
                  </CommonTextField>
                )}
              />
            </Box>
          </Grid>
          {/* <Grid size={12}>
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
          </Grid> */}

          <Grid size={12}>
            <Box>
              <Typography variant="bodyMediumExtraBold" color="grey.600">
                Time
              </Typography>
              <Controller
                name="time"
                control={control}
                render={({ field }) => (
                  <CommonTextField
                    {...field}
                    select
                    fullWidth
                    error={!!errors.time}
                    helperText={
                      errors.time?.message ||
                      (getFilteredTimes().length === 0
                        ? "No available times for selected day and appointment type"
                        : "")
                    }
                    disabled={getFilteredTimes().length === 0}
                  >
                    {getFilteredTimes().map((timeSlot) => (
                      <MenuItem key={timeSlot.time} value={timeSlot.time}>
                        {timeSlot.time}{" "}
                        {timeSlot.type === "phoneCall"
                          ? "(Phone only)"
                          : timeSlot.type === "inPerson"
                          ? "(In-person only)"
                          : ""}
                      </MenuItem>
                    ))}
                  </CommonTextField>
                )}
              />
            </Box>
          </Grid>

          <Grid size={12}>
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
        <Box display="flex" justifyContent="center" mt={2}>
          <StepProgress
            currentStep={step - 1}
            totalSteps={EnStepProgress.TOTAL_STEPS}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default NewAppointmentStep2;
