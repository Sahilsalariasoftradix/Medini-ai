import { Box, Divider, Menu, MenuItem, Typography } from "@mui/material";
import MoreVertIcon from "../../assets/icons/dots-vertical.svg";
import edit from "../../assets/icons/edit-table.svg";
import { overRideSvgColor } from "../../utils/filters";
import CommonDialog from "../common/CommonDialog";
import { Controller, useForm } from "react-hook-form";
import CommonTextField from "../common/CommonTextField";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnCancelAppointment } from "../../utils/enums";
import { availabilityIcons } from "../../utils/Icons";
import dayjs from "dayjs";
import { IDayHeaderProps } from "../../utils/Interfaces";
import CommonSnackbar from "../common/CommonSnackbar";
import AvailabilityTimePicker from "../StepForm/Components/AvailabilityTimePicker";
import { useEditAvailability } from "../../hooks/useEditAvailability";
import {
  AppointmentFormData,
  appointmentSchema,
  menuItemHoverStyle,
} from "../../utils/common";

export function DayHeader({
  day,
  date,
  onEditAvailability,
  onClearDay,
  isAvailable,
  isToday,
  isBeforeToday,
}: IDayHeaderProps) {

  const {
    anchorEl,
    open,
    openModal,
    isAvailabilityModalOpen,
    loading,
    setIsAvailabilityModalOpen,
    setClearAvailabilityModal,
    handleAvailabilitySubmit,
    handleClearAvailability,
    handleEditAvailability,
    handleClick,
    handleClose,
    availabilityForm,
    snackbar,
    handleSnackbarClose,
    setOpenModal,
    clearAvailabilityModal,
    onSubmit,
  } = useEditAvailability();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      reason: EnCancelAppointment.DoctorSick,
    },
  });

  // Parse the full date string to get the day number
  const dayNumber = dayjs(date).format('D');

  const handleMenuItemClick = (action: () => void) => {
    if (action === onClearDay) {
      setClearAvailabilityModal(true);
    } else if (action === onEditAvailability) {
      handleEditAvailability(date);
    } else {
      action();
    }
    handleClose();
  };
  return (
    <Box
      display={"flex"}
      alignItems={"start"}
      justifyContent={"space-between"}
      p={1}
      sx={{
        opacity: isAvailable ? 1 : 0.7,
        backgroundColor: isToday ? "primary.main" : "grey.50",
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
          {dayNumber}
        </Typography>
      </Box>
      {!isBeforeToday && (
        <Box
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
        />
      )}

      {isAvailabilityModalOpen && (
        <CommonDialog
          open={isAvailabilityModalOpen}
          onClose={() => setIsAvailabilityModalOpen(false)}
          title={`Edit Availability for ${dayjs(date).format("MMMM DD")}`}
          cancelText="Cancel"
          confirmText="Mark Available"
          onConfirm={() =>
            availabilityForm.handleSubmit(handleAvailabilitySubmit)(date as any)
          }
          confirmButtonType={"primary"}
          loading={loading}
          disabled={loading}
        >
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mt: 2 }}>
            {["in_person", "phone", "break"].map((key) => {
              return (
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
                        ? "In Person"
                        : key === "phone"
                        ? "Calls Only"
                        : "Break"}
                    </Typography>
                  </Box>
                  <Box display="flex" mt={1} gap={3}>
                    <AvailabilityTimePicker
                      availabilityForm={availabilityForm}
                      label="From"
                      name={`${key}.from`}
                      autoFocus={key === "in_person"}
                    />
                    <AvailabilityTimePicker
                      availabilityForm={availabilityForm}
                      label="To"
                      name={`${key}.to`}
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
          {/* Snackbar */}
          <CommonSnackbar
            open={snackbar.open}
            onClose={handleSnackbarClose}
            message={snackbar.message}
            severity={snackbar.severity}
          />
        </CommonDialog>
      )}

      <CommonDialog
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
      </CommonDialog>

      {/* Clear Availability Dialog */}
      <CommonDialog
        open={clearAvailabilityModal}
        onClose={() => setClearAvailabilityModal(false)}
        title="Clear Availability"
        confirmText="Clear"
        cancelText="Cancel"
        onConfirm={() => handleClearAvailability(date)}
        confirmButtonType="error"
        loading={loading}
        disabled={loading}
      >
        <Divider sx={{ my: 2 }} />
        <Box sx={{ mt: 2 }}>
          <Typography variant="bodyMediumExtraBold" color="grey.600">
            Are you sure you want to clear the availability for this day?
          </Typography>
          <Typography
            variant="bodySmallSemiBold"
            color="grey.500"
            sx={{ mt: 1 }}
          >
            This action cannot be undone.
          </Typography>
        </Box>
      </CommonDialog>

      <Menu
        id="day-menu"
        anchorEl={anchorEl}
        open={open}
        sx={{
          "& .MuiPaper-root": {
            backdropFilter: "blur(5px)",
            backgroundColor: "rgba(255, 255, 255, 0.3)",
            border: "1px solid #358FF7",
            p: 0,
            boxShadow: "0px 5px 10px 0px #0000001A",
            borderRadius: "16px",
          },
        }}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "day-menu-button",
        }}
      >
        <MenuItem
          onClick={() => handleMenuItemClick(onEditAvailability)}
          sx={menuItemHoverStyle}
        >
          <Box component="img" alt="edit." src={edit} />
          <Typography variant="bodySmallSemiBold" color="grey.600">
            Edit Availability
          </Typography>
        </MenuItem>
        {/* <MenuItem
          onClick={() => handleMenuItemClick(onClearDay)}
          sx={menuItemHoverStyle}
        >
          <Box component="img" alt="delete." src={deleteIcn} />
          <Typography variant="bodySmallSemiBold" color="grey.600">
            Clear Day
          </Typography>
        </MenuItem> */}
      </Menu>
    </Box>
  );
}
