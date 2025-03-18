import { Controller, Control, FieldErrors } from "react-hook-form";
import { FormControl, Select, MenuItem, FormHelperText } from "@mui/material";

interface CustomSelectProps {
  name: string;
  control: Control<any>; // Hook Form control
  errors: FieldErrors<any>; // Hook Form errors
  options: { value: string; label: string }[]; // Array of options
  placeholder?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  name,
  control,
  errors,
  options,
  placeholder,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <FormControl fullWidth sx={{ maxHeight: "200px", overflow: "auto" }} error={!!errors[name]}>
          <Select {...field} displayEmpty sx={{ maxHeight: "200px", overflow: "auto" }}>
            {placeholder && <MenuItem value="">{placeholder}</MenuItem>}
            {options.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
          {errors[name] && (
            <FormHelperText>{errors[name]?.message?.toString()}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default CustomSelect;
