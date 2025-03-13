import React from "react";
import Checkbox, { CheckboxProps } from "@mui/material/Checkbox";
import { styled } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import { Typography } from "@mui/material";

// Styled components for the checkbox icons with dynamic sizes and colors
const BpIcon = styled("span")<{
  size: number;
  color: string;
}>(({ theme, size }) => ({
  borderRadius: 50,
  width: size,
  height: size,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow:
    "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
  backgroundColor: "#f5f8fa",
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
  ".Mui-focusVisible &": {
    outline: "2px auto rgba(19,124,189,.6)",
    outlineOffset: 2,
  },
  "input:hover ~ &": {
    backgroundColor: "#ebf1f5",
    ...theme.applyStyles?.("dark", {
      backgroundColor: "#30404d",
    }),
  },
  "input:disabled ~ &": {
    boxShadow: "none",
    background: "rgba(206,217,224,.5)",
    ...theme.applyStyles?.("dark", {
      background: "rgba(57,75,89,.5)",
    }),
  },
  ...theme.applyStyles?.("dark", {
    boxShadow: "0 0 0 1px rgb(16 22 26 / 40%)",
    backgroundColor: "#394b59",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.05),hsla(0,0%,100%,0))",
  }),
}));

const BpCheckedIcon = styled(BpIcon)<{
  size: number;
  color: string;
}>(({ size, color }) => ({
  backgroundColor: color,
  backgroundImage:
    "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
  "&::before": {
    display: "block",
    width: size / 2,
    height: size / 2,
    backgroundImage:
      "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
      " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
      "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
    content: '""',
  },
  "input:hover ~ &": {
    backgroundColor: "#106ba3",
  },
}));

// The dynamic RoundCheckbox component
export function RoundCheckbox({
  label,
  labelPlacement = "end",
  iconSize = 18, // Default size for icons
  checkedIconSize = 18, // Default size for checked icon
  iconColor = "#f5f8fa", // Default color for unchecked icon
  checkedColor = "#358FF7", // Default color for checked icon
  checkedIcon = <BpCheckedIcon size={checkedIconSize} color={checkedColor} />,
  icon = <BpIcon size={iconSize} color={iconColor} />,
  control = <Checkbox />,
  labelMargin = undefined,
  activeLabel = undefined,
  ...props
}: CheckboxProps & {
  label: string;
  labelPlacement?: "start" | "end" | "top" | "bottom";
  iconSize?: number;
  checkedIconSize?: number;
  iconColor?: string;
  checkedColor?: string;
  checkedIcon?: React.ReactNode;
  icon?: React.ReactNode;
  control?: React.ReactNode;
  labelMargin?: string;
  activeLabel?: string;
}) {
  return (
    <FormControlLabel
      labelPlacement={labelPlacement}
      control={React.cloneElement(control as React.ReactElement, {
        sx: {
          "&:hover": { bgcolor: "transparent" },
          padding: { lg: "9px", md: "9px", sm: 0, xs: 0 },
        },
        disableRipple: true,
        color: "default",
        checkedIcon,
        icon,
        inputProps: { "aria-label": label },
        ...props, // Pass all other props to the Checkbox component
      })}
      label={
        <Typography
          variant={activeLabel ? "bodyMediumExtraBold" : 'bodyMediumMedium'} 
          sx={{ mb: { lg: "0px", md: "0px", sm: "5px", xs: "5px" } }}
        >
          {label}
        </Typography>
      }
      sx={{
        margin: label
          ? { lg: labelMargin, md: labelMargin, sm: "5px", xs: "5px" }
          : 0,
        fontSize: { lg: "14px", md: "14px", sm: "12px", xs: "12px" },
      }} // Conditionally set marginLeft to 0 if label is not available
    />
  );
}
