import { Box ,Typography } from "@mui/material";
import { useState } from "react";
import CommonSnackbar from "../common/CommonSnackbar";

interface DayHeaderProps {
  day: string;
  date: number;
  onEditAvailability: () => void;
  onClearDay: () => void;
  isAvailable: boolean;
  isToday: boolean;
}

export function DayHeader({
  day,
  date,
  isAvailable,
  isToday,
}: DayHeaderProps) {
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "error",
  });



  // Closing snackbar
  const handleSnackbarClose = () => {
    setSnackbar((prevSnackbar) => ({
      ...prevSnackbar,
      open: false,
    }));
  };
  console.log(isAvailable)

  return (
    <Box
      alignItems={"start"}
      justifyContent={"space-between"}
      p={1}
      sx={{
        opacity: isAvailable ? 1 : 0.7,
        backgroundColor: isToday ? "#358FF7" : isAvailable ? "#FFFFFF" : "grey.50",
        border: "1px solid #EDF2F7",
      }}
    >
      <Box>
        <Typography
          variant="bodyMediumExtraBold"
          sx={{ color: isToday ? "additional.white" : "grey.600" }}
        >
          {day}
        </Typography>
        <Typography
          variant="bodyMediumExtraBold"
          color={isToday ? "additional.white" : "grey.600"}
        >
          {date}
        </Typography>
      </Box>
    
      
      {/* Snackbar */}
      <CommonSnackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
}
