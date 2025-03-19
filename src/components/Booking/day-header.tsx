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
import { availabilityIcons, InPersonIcon } from "../../utils/Icons";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import {
  postAvailabilitySpecific,
  postUnAvailabilitySpecific,
} from "../../api/userApi";
import { IAvailabilityPayload, IDayHeaderProps } from "../../utils/Interfaces";
import { useAvailability } from "../../store/AvailabilityContext";
import CommonSnackbar from "../common/CommonSnackbar";
import { useAuth } from "../../store/AuthContext";

export const menuItemHoverStyle = {
  "&:hover": {
    filter: overRideSvgColor.blue,
  },
  gap: 1,
};

export const appointmentSchema = z.object({
  reason: z.enum(Object.values(EnCancelAppointment) as [string, ...string[]]),
});

export const availabilitySchema = z.object({
  isAvailable: z.boolean(),
  phone: z
    .object({
      from: z.string(),
      to: z.string(),
    })
,
  in_person: z
    .object({
      from: z.string(),
      to: z.string(),
    }),

  break: z
    .object({
      from: z.string(),
      to: z.string(),
    })
    .optional(),
});

export type AppointmentFormData = z.infer<typeof appointmentSchema>;
export type AvailabilityFormData = z.infer<typeof availabilitySchema>;

export function DayHeader({
  day,
  date,
  onEditAvailability,
  onClearDay,
  isAvailable,
  isToday,
}: IDayHeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openModal, setOpenModal] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { refreshAvailability } = useAvailability();
  const isPastDays = dayjs().isSameOrBefore(dayjs().date(date), "day");

  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "error",
  });
  const [clearAvailabilityModal, setClearAvailabilityModal] = useState(false);

  const handleEditAvailability = () => {
    const selectedAvailability = availabilities.find(
      //@ts-ignore
      (avail) => avail.date === dayjs().set("date", date).format("YYYY-MM-DD")
    );

    // First set the modal to open
    setIsAvailabilityModalOpen(true);

    // Then reset the form with a slight delay to ensure the modal is rendered
    setTimeout(() => {
      availabilityForm.reset({
        isAvailable: true,
        in_person: {
          from: selectedAvailability?.in_person_start_time
            ? selectedAvailability.in_person_start_time
                .split(":")
                .slice(0, 2)
                .join(":")
            : "",
          to: selectedAvailability?.in_person_end_time
            ? selectedAvailability.in_person_end_time
                .split(":")
                .slice(0, 2)
                .join(":")
            : "",
        },
        phone: {
          from: selectedAvailability?.phone_start_time
            ? selectedAvailability.phone_start_time
                .split(":")
                .slice(0, 2)
                .join(":")
            : "",
          to: selectedAvailability?.phone_end_time
            ? selectedAvailability.phone_end_time
                .split(":")
                .slice(0, 2)
                .join(":")
            : "",
        },
        break: {
          from: selectedAvailability?.break_start_time
            ? selectedAvailability.break_start_time
                .split(":")
                .slice(0, 2)
                .join(":")
            : "",
          to: selectedAvailability?.break_end_time
            ? selectedAvailability.break_end_time
                .split(":")
                .slice(0, 2)
                .join(":")
            : "",
        },
      });
    }, 0);
  };
  const handleClearAvailability = async () => {
    setLoading(true);
    try {
      const selectedAvailability = availabilities.find(
        //@ts-ignore
        (avail) => avail.date === dayjs().set("date", date).format("YYYY-MM-DD")
      );

      await postUnAvailabilitySpecific({
        user_id: userDetails?.user_id,
        date: dayjs().set("date", date).format("YYYY-MM-DD"),
        phone_start_time: selectedAvailability?.phone_start_time,
        phone_end_time: selectedAvailability?.phone_end_time,
        in_person_start_time: selectedAvailability?.in_person_start_time,
        in_person_end_time: selectedAvailability?.in_person_end_time,
      });

      setSnackbar({
        open: true,
        message: "Availability cleared successfully",
        severity: "success",
      });
      await refreshAvailability();
    } catch (error) {
      console.log(error, "error");
      setSnackbar({
        open: true,
        message: "Failed to clear availability",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setClearAvailabilityModal(false);
    }
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
  const { availabilities } = useAvailability();
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
      setClearAvailabilityModal(true);
    } else if (action === onEditAvailability) {
      handleEditAvailability();
    } else {
      action();
    }
    handleClose();
  };

  const onSubmit = () => {
    setOpenModal(false);
  };

  const { userDetails } = useAuth();

  const handleAvailabilitySubmit = async (data: AvailabilityFormData) => {
    setLoading(true);

    try {
      // Error validation setup
      let hasError = false;
      let errorMessage = "";

      // Validate at least one booking type has times set
      const hasPhoneTimes = data.phone?.from && data.phone?.to;
      const hasInPersonTimes = data.in_person?.from && data.in_person?.to;
      
      if (!hasPhoneTimes && !hasInPersonTimes) {
        hasError = true;
        errorMessage = "Please set times for at least one booking type";
      }

      // Convert string times to Day.js objects
      const phoneStart = hasPhoneTimes ? dayjs(data.phone.from, "HH:mm") : null;
      const phoneEnd = hasPhoneTimes ? dayjs(data.phone.to, "HH:mm") : null;
      const inPersonStart = hasInPersonTimes ? dayjs(data.in_person.from, "HH:mm") : null;
      const inPersonEnd = hasInPersonTimes ? dayjs(data.in_person.to, "HH:mm") : null;
      const breakStart = data.break?.from ? dayjs(data.break.from, "HH:mm") : null;
      const breakEnd = data.break?.to ? dayjs(data.break.to, "HH:mm") : null;

      // Function to check time overlap
      const isOverlap = (
        start1: dayjs.Dayjs | null,
        end1: dayjs.Dayjs | null,
        start2: dayjs.Dayjs | null,
        end2: dayjs.Dayjs | null
      ) => {
        if (!start1 || !end1 || !start2 || !end2) return false;
        return start1.isBefore(end2) && start2.isBefore(end1);
      };

      // Check for invalid time ranges
      if (phoneStart && phoneEnd && phoneStart.isAfter(phoneEnd)) {
        hasError = true;
        errorMessage = "Phone start time cannot be after end time";
      } else if (inPersonStart && inPersonEnd && inPersonStart.isAfter(inPersonEnd)) {
        hasError = true;
        errorMessage = "In-person start time cannot be after end time";
      } else if (breakStart && breakEnd && breakStart.isAfter(breakEnd)) {
        hasError = true;
        errorMessage = "Break start time cannot be after end time";
      } else if (
        phoneStart &&
        phoneEnd &&
        inPersonStart &&
        inPersonEnd &&
        isOverlap(phoneStart, phoneEnd, inPersonStart, inPersonEnd)
      ) {
        hasError = true;
        errorMessage = "Phone and In-person times cannot overlap";
      }
      
      // // Check if break times overlap with either phone or in-person
      // if (!hasError && breakStart && breakEnd) {
      //   if (phoneStart && phoneEnd && isOverlap(phoneStart, phoneEnd, breakStart, breakEnd)) {
      //     hasError = true;
      //     errorMessage = "Break times cannot overlap with Phone times";
      //   } else if (inPersonStart && inPersonEnd && isOverlap(inPersonStart, inPersonEnd, breakStart, breakEnd)) {
      //     hasError = true;
      //     errorMessage = "Break times cannot overlap with In-person times";
      //   }
      // }

      // If there is an error, show it and stop submission
      if (hasError) {
        setSnackbar({ 
          open: true, 
          message: errorMessage, 
          severity: "error" 
        });
        setLoading(false);
        return;
      }

      // Only proceed if validation passes
      const payload: IAvailabilityPayload = {
        user_id: userDetails?.user_id,
        date: dayjs().set("date", date).format("YYYY-MM-DD"),
        phone_start_time: data.phone?.from ? `${data.phone.from}:00` : null,
        phone_end_time: data.phone?.to ? `${data.phone.to}:00` : null,
        in_person_start_time: data.in_person?.from ? `${data.in_person.from}:00` : null,
        in_person_end_time: data.in_person?.to ? `${data.in_person.to}:00` : null,
        break_start_time: data.break?.from ? `${data.break.from}:00` : null,
        break_end_time: data.break?.to ? `${data.break.to}:00` : null,
      };
      //@ts-ignore
      const response = await postAvailabilitySpecific(payload);

      await refreshAvailability();

      setSnackbar({
        open: true,
        message: response?.message || "Availability updated successfully",
        severity: "success",
      });
      setIsAvailabilityModalOpen(false);
    } catch (error) {
      console.error("Error setting availability:", error);
      setSnackbar({
        open: true,
        message: "Failed to set availability. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  
  

  // Closing snackbar
  const handleSnackbarClose = () => {
    setSnackbar((prevSnackbar) => ({
      ...prevSnackbar,
      open: false,
    }));
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
              ampm={false}
              //@ts-ignore
              value={field.value ? dayjs(field.value, "HH:mm") : null}
              onChange={(newValue) => {
                field.onChange(
                  newValue?.format("HH:mm") &&
                    newValue?.format("HH:mm") !== "Invalid Date"
                    ? newValue?.format("HH:mm")
                    : ""
                );
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
      {isPastDays && (
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
          title="Edit Availability"
          cancelText="Cancel"
          confirmText="Mark Available"
          onConfirm={availabilityForm.handleSubmit(handleAvailabilitySubmit)}
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
                    <AvailabilityTimePicker label="From" name={`${key}.from`} />
                    <AvailabilityTimePicker label="To" name={`${key}.to`} />
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
        onConfirm={handleClearAvailability}
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
