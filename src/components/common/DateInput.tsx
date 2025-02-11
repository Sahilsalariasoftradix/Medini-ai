import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import calenderIcon from "../../assets/icons/calender-date.svg";

interface DateInputProps {
  value: Dayjs;
  onChange: (date: Dayjs | null) => void;
  shouldDisableDate?: (date: Dayjs) => boolean;
  label?: string;
  error?: boolean;
  helperText?: string;
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
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
        value={value}
        onChange={onChange}
        shouldDisableDate={shouldDisableDate}
        slots={{
          openPickerIcon: CalendarIcon,
        }}
        slotProps={{
          textField: {
            fullWidth: true,
            error,
            helperText,
          },
        }}
      />
    </LocalizationProvider>
  );
}
