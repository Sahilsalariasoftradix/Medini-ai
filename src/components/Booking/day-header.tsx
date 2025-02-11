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
type AppointmentFormData = z.infer<typeof appointmentSchema>;
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

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMenuItemClick = (action: () => void) => {
    if (action === onClearDay) {
      setOpenModal(true);
    } else {
      action();
    }
    handleClose();
  };
  const onSubmit = (data: AppointmentFormData) => {
    console.log("Form data:", data);
    setOpenModal(false);
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
