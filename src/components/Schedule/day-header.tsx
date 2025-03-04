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

  
  // const handleAvailabilitySubmit = async (data: AvailabilityFormData) => {
  //   setLoading(true);
  //   try {
  //     const payload: IAvailabilityPayload = {
  //       user_id: EStaticID.ID,
  //       date: dayjs().set("date", date).format("YYYY-MM-DD"),
  //       phone_start_time: `${data.phone.from}:00`,
  //       phone_end_time: `${data.phone.to}:00`,
  //       in_person_start_time: `${data.in_person.from}:00`,
  //       in_person_end_time: `${data.in_person.to}:00`,
  //       break_start_time: `${data.break.from}:00`,
  //       break_end_time: `${data.break.to}:00`,
  //     };

  //     const response = await postAvailabilitySpecific(payload);

  //     // Add a small delay to ensure the backend has processed the update
  //     await new Promise((resolve) => setTimeout(resolve, 500));

  //     // Refresh the availability data
  //     await refreshAvailability();
  //     setSnackbar({
  //       open: true,
  //       message: response?.message, // Use the response message here
  //       severity: "success", // Assuming you want success severity here
  //     });

  //     setIsAvailabilityModalOpen(false);
  //   } catch (error) {
  //     console.error("Error setting availability:", error);
  //     setSnackbar({
  //       open: true,
  //       message: "Failed to set availability. Please try again.",
  //       severity: "error",
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Closing snackbar
  const handleSnackbarClose = () => {
    setSnackbar((prevSnackbar) => ({
      ...prevSnackbar,
      open: false,
    }));
  };

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
      {/* <Box
        id="day-menu-button"
        aria-controls={open ? "day-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        component="img"
        sx={{
          p: 0,
          cursor: "pointer",
          filter:
            isToday && !open
              ? overRideSvgColor.white
              : open
              ? overRideSvgColor.blue
              : "blue",
        }}
        alt="More."
        src={MoreVertIcon}
        onClick={handleClick}
      /> */}

      {/* {isAvailabilityModalOpen && (
        <CommonDialog
          open={isAvailabilityModalOpen}
          onClose={() => setIsAvailabilityModalOpen(false)}
          title="Availability"
          cancelText="Cancel"
          confirmText="Mark Available"
          onConfirm={availabilityForm.handleSubmit(handleAvailabilitySubmit)}
          confirmButtonType={"primary"}
          loading={loading}
          disabled={loading}
        >
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mt: 2 }}>
            {["in_person", "phone", "break"].map((key) => (
              <Box key={key} mt={3}>
                <Box display="flex" gap={1} alignItems="center">
                  <Box
                    component="img"
                    sx={{ height: 21, width: 21 }}
                    //@ts-ignore
                    alt={availabilityIcons[key]}
                    //@ts-ignore
                    src={availabilityIcons[key]}
                  />
                  <Typography variant="bodyMediumExtraBold">
                    {key === "in_person"
                      ? "In Office"
                      : key === "phone"
                      ? "Calls Only"
                      : "Break"}
                  </Typography>
                </Box>
                <Box display="flex" mt={1} gap={3}>
                  <AvailabilityTimePicker label="From" name={`${key}.from`} />
                  <AvailabilityTimePicker label="To" name={`${key}.to`} />
                </Box>
              </Box>
            ))}
          </Box>
        </CommonDialog>
      )} */}

      {/* <CommonDialog
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        confirmButtonType={"error"}
        title="Delete Appointment"
        confirmText="Yes Delete it"
        cancelText="Cancel"
        onConfirm={handleSubmit(onSubmit)}
      >
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Typography variant="bodyMediumExtraBold">
            Reason for cancellation
          </Typography>
          <Controller
            name="reason"
            control={control}
            render={({ field }) => (
              <CommonTextField
                {...field}
                select
                fullWidth
                error={!!errors.reason}
                helperText={errors.reason?.message}
              >
                {Object.keys(EnCancelAppointment).map((key) => {
                  const value =
                    EnCancelAppointment[
                      key as keyof typeof EnCancelAppointment
                    ];
                  return (
                    <MenuItem key={key} value={value}>
                      {value}
                    </MenuItem>
                  );
                })}
              </CommonTextField>
            )}
          />
        </Box>
      </CommonDialog> */}
      
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
