import { Controller, Control, FieldErrors } from "react-hook-form";
import { Box, FormControlLabel, FormHelperText, Switch, SwitchProps, styled } from "@mui/material";
const IOSSwitch = styled((props: SwitchProps) => (
    <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
  ))(({ theme }) => ({
    width: 41,
    height: 24,
    padding: 0,
    "& .MuiSwitch-switchBase": {
      padding: 0,
      margin: 2,
      transitionDuration: "300ms",
      "&.Mui-checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + .MuiSwitch-track": {
          backgroundColor: "primary.main",
          opacity: 1,
          border: 0,
          ...theme.applyStyles("dark", {
            backgroundColor: "#2ECA45",
          }),
        },
        "&.Mui-disabled + .MuiSwitch-track": {
          opacity: 0.5,
        },
      },
      "&.Mui-focusVisible .MuiSwitch-thumb": {
        color: "#33cf4d",
        border: "6px solid #fff",
      },
      "&.Mui-disabled .MuiSwitch-thumb": {
        color: theme.palette.grey[100],
        ...theme.applyStyles("dark", {
          color: theme.palette.grey[600],
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.7,
        ...theme.applyStyles("dark", {
          opacity: 0.3,
        }),
      },
    },
    "& .MuiSwitch-thumb": {
      boxSizing: "border-box",
      width: 20,
      height: 20,
    },
    "& .MuiSwitch-track": {
      borderRadius: 26 / 2,
      backgroundColor: "#E9E9EA",
      opacity: 1,
      transition: theme.transitions.create(["background-color"], {
        duration: 500,
      }),
      ...theme.applyStyles("dark", {
        backgroundColor: "#39393D",
      }),
    },
  }));
interface CustomSwitchProps {
  name: string;
  control: Control<any>; // Hook Form control
  errors: FieldErrors<any>; // Hook Form errors
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({ name, control, errors }) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box>
          <FormControlLabel
            label=""
            control={
              <IOSSwitch
                {...field}
                checked={field.value} // Ensure it's controlled
                onChange={(e) => field.onChange(e.target.checked)} // Update Hook Form state
              />
            }
          />
          {/* {errors[name] && (
            <FormHelperText error>{errors[name]?.message}</FormHelperText>
          )} */}
        </Box>
      )}
    />
  );
};

export default CustomSwitch;
