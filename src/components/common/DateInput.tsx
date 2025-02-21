import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import calenderIcon from "../../assets/icons/calender-date.svg";
import { useState } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

interface DateInputProps {
  value: Dayjs;
  onChange: (date: Dayjs | null) => void;
  shouldDisableDate?: (date: Dayjs) => boolean;
  label?: string;
  error?: boolean;
  helperText?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}

const CalendarIcon = () => <img src={calenderIcon} alt="calender" />;
export default function DateInput({
  value,
  onChange,
  shouldDisableDate,
  label = "Date",
  error,
  helperText,
}: DateInputProps) {
  const [open, setOpen] = useState(false);
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        open={open}
        onClose={() => setOpen(false)}
        label={label}
        value={value}
        onChange={onChange}
        shouldDisableDate={shouldDisableDate}
        slots={{
          openPickerIcon: CalendarIcon,
        }}
        slotProps={{
          field: {
            readOnly: true,
          },

          textField: {
            onClick: () => setOpen(true),
            fullWidth: true,
            error,
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            helperText,
          },
        }}
      />
    </LocalizationProvider>
  );
}
