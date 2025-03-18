import { Controller, UseFormReturn } from "react-hook-form";
import { AvailabilityFormData } from "../../Booking/day-header";
import { Box, Typography } from "@mui/material";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { InPersonIcon } from "../../../utils/Icons";
import dayjs from "dayjs";

const AvailabilityTimePicker = ({
  label,
  name,
  availabilityForm,
}: {
  label: string;
  name: `${string}.${string}`;
  availabilityForm: UseFormReturn<AvailabilityFormData>;
}) => {
  return (
    <Box>
      <Typography variant="bodyMediumExtraBold" color="grey.600" mb={1}>
        {label}
      </Typography>

      <Controller
           //@ts-ignore
        name={name}
        control={availabilityForm.control}
        render={({ field, fieldState }) => (
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <TimePicker
              ampm={false}
              //@ts-ignore
              value={field.value ? dayjs(field.value, "HH:mm") : null}
              onChange={(newValue) => {
                field.onChange(newValue?.format("HH:mm") &&  newValue?.format("HH:mm") !== "Invalid Date" ? newValue?.format("HH:mm") : "");
              }}
              format="HH:mm"
              slotProps={{
                textField: {
                  placeholder: label === "From" ? "Start time" : "End time",
                  error: !!fieldState.error,
                  helperText: fieldState.error?.message,
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
  );
};

export default AvailabilityTimePicker;
