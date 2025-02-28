import { Box, Divider, Menu, MenuItem, Typography } from "@mui/material";
import MoreVertIcon from "../../assets/icons/dots-vertical.svg";
import edit from "../../assets/icons/edit-table.svg";
import deleteIcn from "../../assets/icons/delete-tr.svg";
import { overRideSvgColor } from "../../utils/filters";
import CommonDialog from "../common/CommonDialog";
import { Controller, useForm } from "react-hook-form";
import CommonTextField from "../common/CommonTextField";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { EnCancelAppointment } from "../../utils/enums";
import { useState } from "react";
import { availabilityIcons, editAvailabilityIcons } from "../../utils/Icons";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { postAvailabilitySpecific } from "../../api/userApi";
import { IAvailabilityPayload } from "../../utils/Interfaces";

interface DayHeaderProps {
  day: string;
  date: number;
  onEditAvailability: () => void;
  onClearDay: () => void;
  isAvailable: boolean;
  isToday: boolean;
}
const menuItemHoverStyle = {
  "&:hover": {
    filter: overRideSvgColor.blue,
  },
  gap: 1,
};
const appointmentSchema = z.object({
  reason: z.enum(Object.values(EnCancelAppointment) as [string, ...string[]]),
});

const availabilitySchema = z.object({
  isAvailable: z.boolean(),
  phone: z.object({
    from: z.string().min(1, "Start time is required"),
    to: z.string().min(1, "End time is required"),
  }),
  in_person: z.object({
    from: z.string().min(1, "Start time is required"),
    to: z.string().min(1, "End time is required"),
  }),
  break: z.object({
    from: z.string(),
    to: z.string(),
  }),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;
type AvailabilityFormData = z.infer<typeof availabilitySchema>;



export function DayHeader({
  day,
  date,
  onEditAvailability,
  onClearDay,
  isAvailable,
  isToday,
}: DayHeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openModal, setOpenModal] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const handleEditAvailability = () => {
    setIsAvailabilityModalOpen(true);
  };

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

  const availabilityForm = useForm<AvailabilityFormData>({
    resolver: zodResolver(availabilitySchema),
    defaultValues: {
      isAvailable: false,
      phone: { from: "", to: "" },
      in_person: { from: "", to: "" },
      break: { from: "", to: "" },
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = (action: () => void) => {
    if (action === onClearDay) {
      setOpenModal(true);
    } else if (action === onEditAvailability) {
      handleEditAvailability();
    } else {
      action();
    }
    handleClose();
  };

  const onSubmit = (data: AppointmentFormData) => {
    console.log("Form data:", data);
    setOpenModal(false);
  };
  const InPersonIcon = () => (
    <img src={editAvailabilityIcons.clock} alt="icon" />
  );
  // const appointmentTypes = [
  //   { key: "in_person", label: "In Office", icon: availabilityIcons.in_person },
  //   { key: "phone", label: "Calls Only", icon: availabilityIcons.phone },
  //   { key: "break", label: "Lunch/Break", icon: availabilityIcons.break },
  // ];
  const handleAvailabilitySubmit = async (data: AvailabilityFormData) => {
    setLoading(true);
    try {
      const payload: IAvailabilityPayload = {
        user_id: 1, // Replace with actual user ID from your auth context
        date: dayjs().set("date", date).format("YYYY-MM-DD"), // Replace with actual selected date
        phone_start_time: `${data.phone.from}:00`,
        phone_end_time: `${data.phone.to}:00`,
        in_person_start_time: `${data.in_person.from}:00`,
        in_person_end_time: `${data.in_person.to}:00`,
        break_start_time: `${data.in_person.from}:00`,
        break_end_time: `${data.in_person.to}:00`,
      };

      await postAvailabilitySpecific(payload);
      setIsAvailabilityModalOpen(false);
      // Optionally refresh the calendar or show success message
    } catch (error) {
      console.error("Error setting availability:", error);
      // Handle error (show error message to user)
    } finally {
      setLoading(false);
    }
  };

  const AvailabilityTimePicker = ({
    label,
    name,
  }: {
    label: string;
    name: `${string}.${string}`;
  }) => (
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
              //@ts-ignore
              value={field.value ? dayjs(field.value, "HH:mm") : null}
              onChange={(newValue) =>
                field.onChange(newValue?.format("HH:mm") || "")
              }
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
              }}
              slots={{ openPickerIcon: InPersonIcon }}
            />
          </LocalizationProvider>
        )}
      />
    </Box>
  );

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
          {date}
        </Typography>
      </Box>
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

      {isAvailabilityModalOpen && (
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
        <MenuItem
          onClick={() => handleMenuItemClick(onClearDay)}
          sx={menuItemHoverStyle}
        >
          <Box component="img" alt="delete." src={deleteIcn} />
          <Typography variant="bodySmallSemiBold" color="grey.600">
            Clear Day
          </Typography>
        </MenuItem>
      </Menu>
    </Box>
  );
}
