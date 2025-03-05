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
import { EnCancelAppointment, EStaticID } from "../../utils/enums";
import { useState } from "react";
import { availabilityIcons, editAvailabilityIcons } from "../../utils/Icons";
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
}: IDayHeaderProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [openModal, setOpenModal] = useState(false);
  const [isAvailabilityModalOpen, setIsAvailabilityModalOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { refreshAvailability } = useAvailability();
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "error",
  });
  console.log(snackbar,'k')
  const [clearAvailabilityModal, setClearAvailabilityModal] = useState(false);

  const handleEditAvailability = () => {
    const selectedAvailability = availabilities.find(
      //@ts-ignore
      (avail) => avail.date === dayjs().set("date", date).format("YYYY-MM-DD")
    );

    console.log('Selected Availability:', selectedAvailability); // Debug log

    // First set the modal to open
    setIsAvailabilityModalOpen(true);

    // Then reset the form with a slight delay to ensure the modal is rendered
    setTimeout(() => {
      availabilityForm.reset({
        isAvailable: true,
        in_person: {
          from: selectedAvailability?.in_person_start_time
            ? selectedAvailability.in_person_start_time.split(":").slice(0, 2).join(":")
            : "",
          to: selectedAvailability?.in_person_end_time
            ? selectedAvailability.in_person_end_time.split(":").slice(0, 2).join(":")
            : "",
        },
        phone: {
          from: selectedAvailability?.phone_start_time
            ? selectedAvailability.phone_start_time.split(":").slice(0, 2).join(":")
            : "",
          to: selectedAvailability?.phone_end_time
            ? selectedAvailability.phone_end_time.split(":").slice(0, 2).join(":")
            : "",
        },
        break: { from: "", to: "" },
      });

      console.log('Form Values After Reset:', availabilityForm.getValues()); // Debug log
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
        user_id: EStaticID.ID,
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
      console.log(error,'error')
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

  const onSubmit = (data: AppointmentFormData) => {
    console.log("Form data:", data);
    setOpenModal(false);
  };
  const InPersonIcon = () => (
    <img src={editAvailabilityIcons.clock} alt="icon" />
  );
  
  const handleAvailabilitySubmit = async (data: AvailabilityFormData) => {
    setLoading(true);

    // Convert string times to dayjs objects for comparison
    const phoneStart = dayjs(data.phone.from, "HH:mm");
    const phoneEnd = dayjs(data.phone.to, "HH:mm");
    const inPersonStart = dayjs(data.in_person.from, "HH:mm");
    const inPersonEnd = dayjs(data.in_person.to, "HH:mm");
    const breakStart = dayjs(data.break.from, "HH:mm");
    const breakEnd = dayjs(data.break.to, "HH:mm");

    // Function to check if two time ranges overlap
    const isOverlap = (
      start1: dayjs.Dayjs,
      end1: dayjs.Dayjs,
      start2: dayjs.Dayjs,
      end2: dayjs.Dayjs
    ) => {
      return start1.isBefore(end2) && start2.isBefore(end1);
    };

    let errorMessage = "";
  

    switch (true) {
      case phoneStart.isAfter(phoneEnd):
        errorMessage = "Phone start time cannot be after end time.";
        break;
      case inPersonStart.isAfter(inPersonEnd):
        errorMessage = "In-person start time cannot be after end time.";
        break;
      case breakStart.isAfter(breakEnd):
        errorMessage = "Break start time cannot be after end time.";
        break;
      case isOverlap(phoneStart, phoneEnd, inPersonStart, inPersonEnd):
        errorMessage = "Phone and In-person times cannot overlap.";
        break;
      case isOverlap(phoneStart, phoneEnd, breakStart, breakEnd):
        errorMessage = "Phone and Break times cannot overlap.";
        break;
      case isOverlap(inPersonStart, inPersonEnd, breakStart, breakEnd):
        errorMessage = "In-person and Break times cannot overlap.";
        break;
      default:
        break;
    }

    if (errorMessage) {
      setSnackbar({ open: true, message: errorMessage, severity: "error" });
      setLoading(false);
      console.log(errorMessage)
      return;
    }

    try {
      const payload: IAvailabilityPayload = {
        user_id: EStaticID.ID,
        date: dayjs().set("date", date).format("YYYY-MM-DD"),
        phone_start_time: `${data.phone.from}:00`,
        phone_end_time: `${data.phone.to}:00`,
        in_person_start_time: `${data.in_person.from}:00`,
        in_person_end_time: `${data.in_person.to}:00`,
        // break_start_time: `${data.break.from}:00`,
        // break_end_time: `${data.break.to}:00`,
      };

      const response = await postAvailabilitySpecific(payload);

      await new Promise((resolve) => setTimeout(resolve, 500));

      await refreshAvailability();

      setSnackbar({
        open: true,
        message: response?.message,
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
              onChange={(newValue) =>
                field.onChange(newValue?.format("HH:mm") || "")
              }
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
                actionBar:{
                  actions:['accept'],
                }
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
            {["in_person", "phone"].map((key) => (
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
            ))}
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
          <Typography variant="bodySmallSemiBold" color="grey.500" sx={{ mt: 1 }}>
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
