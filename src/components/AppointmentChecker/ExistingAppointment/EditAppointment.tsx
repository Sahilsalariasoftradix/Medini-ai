import { Box, FormHelperText, MenuItem, Typography } from "@mui/material";
import CommonTextField from "../../common/CommonTextField";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import questionMark from "../../../assets/icons/question.svg";

import SearchInput from "../../common/SearchInput";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { calenderIcon } from "../../Booking/Form/SlotBookingForm";
import { useState } from "react";
import { Dayjs } from "dayjs";
import { InPersonIcon } from "../../../utils/Icons";
import CommonButton from "../../common/CommonButton";
import {
  EditAppointmentSchema,
  EditAppointmentSchemaType,
  useAppointmentChecker,
} from "../../../store/AppointmentCheckerContext";
import dayjs from "dayjs";

export const clinicOptions = [
  { title: "Downtown Medical Center", value: "downtown_medical" },
  { title: "Sunrise Health Clinic", value: "sunrise_health" },
  { title: "Greenwood Family Care", value: "greenwood_family" },
  { title: "Lakeside Urgent Care", value: "lakeside_urgent" },
  { title: "Hilltop Wellness Center", value: "hilltop_wellness" },
];
const EditAppointment = () => {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<Dayjs | null>(null);
  const { step, setStep } = useAppointmentChecker();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<EditAppointmentSchemaType>({
    resolver: zodResolver(EditAppointmentSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      bypass_key: "",
      appointment_location: "",
      appointmentType: "inPerson",
      date: undefined,
      time: undefined,
      length: "15",
    },
  });
  console.log(errors);

  const onSubmit = (data: any) => {
    // Create a properly formatted data object for submission
    const formattedData = {
      ...data,
      date: selectedDate ? dayjs(selectedDate).format("YYYY-MM-DD") : "",
      time: selectedTime ? dayjs(selectedTime).format("HH:mm") : "",
    };

    try {
      // Validate with Zod schema
      const validatedData = EditAppointmentSchema.parse(formattedData);
      console.log("Valid data:", validatedData);
      setStep(step - 1);

      // Proceed with form submission
      // Call your API or next step here
    } catch (error) {
      console.error("Validation error:", error);
    }
  };

  return (
    <Box>
      <Typography
        align="center"
        variant="h3"
        my={2}
        sx={{ fontSize: { xs: 24, md: 28 } }}
      >
        Edit Appointment
      </Typography>
      <Typography
        align="center"
        variant="bodyLargeMedium"
        sx={{ mb: 5 }}
        color="grey.600"
      >
        Please verify your personal info to help us find your appointment.
      </Typography>
      <Box>
        <Typography variant="bodyMediumExtraBold">Patient Details</Typography>
        <Box my={2}>
          <Typography color="grey.600" variant="bodyMediumExtraBold">
            First Name
          </Typography>
          <CommonTextField
            placeholder="First Name"
            register={register("first_name")}
            errorMessage={errors.first_name?.message}
          />
        </Box>
        <Box my={2}>
          <Typography mt={1} color="grey.600" variant="bodyMediumExtraBold">
            Last Name
          </Typography>
          <CommonTextField
            placeholder="Last Name"
            register={register("last_name")}
            errorMessage={errors.last_name?.message}
          />
        </Box>
        <Box my={2}>
          <Typography mt={1} color="grey.600" variant="bodyMediumExtraBold">
            Phone
          </Typography>
          <CommonTextField
            placeholder="Phone"
            register={register("phone")}
            errorMessage={errors.phone?.message}
          />
        </Box>
        <Box my={2}>
          <Typography mt={1} color="grey.600" variant="bodyMediumExtraBold">
            Email
          </Typography>
          <CommonTextField
            placeholder="Email"
            register={register("email")}
            errorMessage={errors.email?.message}
          />
        </Box>
        <Box my={2}>
          <Typography mt={1} color="grey.600" variant="bodyMediumExtraBold">
            Bypass key
          </Typography>
          <CommonTextField
            placeholder="Bypass key"
            register={register("bypass_key")}
            errorMessage={errors.bypass_key?.message}
          />
        </Box>
        <Box my={2}>
          <Typography mt={1} color="grey.600" variant="bodyMediumExtraBold">
            Where is your appointment?
          </Typography>
          <Controller
            name="appointment_location"
            control={control}
            render={({ field }) => {
              const selectedOption =
                clinicOptions.find((option) => option.value === field.value) ||
                null;

              return (
                <SearchInput
                  options={clinicOptions}
                  placeholder="Search for your appointment"
                  value={selectedOption}
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
        <Box my={2}>
          <Typography variant="bodySmallExtraBold">Clinic Name</Typography>
          <Typography variant="bodySmallMedium">
            9662 Runte Fields, Port Eugene 44128. Canada
          </Typography>
          <Typography variant="bodySmallMedium">
            (651) 522-3704 x8807
          </Typography>
        </Box>
        <Box my={2}>
          <Typography variant="bodyMediumExtraBold">
            Appointment Details
          </Typography>

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
                    field.onChange(
                      newValue ? dayjs(newValue).format("YYYY-MM-DD") : ""
                    );
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
          <FormHelperText>{errors.date?.message}</FormHelperText>
        </Box>
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
                    field.onChange(
                      newValue ? dayjs(newValue).format("HH:mm") : ""
                    );
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
        <Box my={2}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="bodyMediumExtraBold" color="grey.600">
              Length
            </Typography>
            <img src={questionMark} alt="" />
          </Box>
          <Controller
            name="length"
            control={control}
            defaultValue="15"
            render={({ field }) => (
              <CommonTextField
                {...field}
                select
                fullWidth
                error={!!errors.length}
                helperText={errors.length?.message}
              >
                <MenuItem value="15">15 minutes</MenuItem>
                <MenuItem value="30">30 minutes</MenuItem>
                <MenuItem value="45">45 minutes</MenuItem>
                <MenuItem value="60">60 minutes</MenuItem>
              </CommonTextField>
            )}
          />
        </Box>
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
        <Box my={4} display="flex" gap={2}>
          <CommonButton
            text="Cancel"
            variant="contained"
            color="secondary"
            fullWidth
            onClick={() => {
              setStep(step - 1);
            }}
          />
          <CommonButton
            text="Edit Appointment"
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleSubmit(onSubmit)}
          >
            Edit Appointment
          </CommonButton>
        </Box>
      </Box>
    </Box>
  );
};

export default EditAppointment;
