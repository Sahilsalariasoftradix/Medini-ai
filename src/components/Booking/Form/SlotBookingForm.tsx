import { Controller } from "react-hook-form";
import { Box, Divider, MenuItem, Typography } from "@mui/material";

import addIcon from "../../../assets/icons/add-icn.svg";
import questionMark from "../../../assets/icons/question.svg";
import SearchInput from "../../common/SearchInput";
import CommonButton from "../../common/CommonButton";
import DateInput from "../../common/DateInput";
import CommonTextField from "../../common/CommonTextField";
import dayjs, { Dayjs } from "dayjs";
import { IFilm } from "../../../utils/Interfaces";
import { useState } from "react";

import AddContact from "./AddContact";

// type SlotBookingFormValues = {
//   contact: string;
//   date: string;
//   startTime: string;
//   length: string;
//   appointmentType: string;
//   reasonForCall: string;
// };

interface SlotBookingFormProps {
  control: any;
  errors: any;
  openContactSearch: boolean;
  handleOpen: () => void;
  handleClose: () => void;
  options: readonly IFilm[];
  loading: { input: boolean };
  shouldDisableDate: (date: Dayjs) => boolean;
  selectedDate: dayjs.Dayjs;
}

const SlotBookingForm: React.FC<SlotBookingFormProps> = ({
  control,
  errors,
  openContactSearch,
  handleOpen,
  handleClose,
  options,
  loading,
  shouldDisableDate,
  selectedDate,
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  return (
    <>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="bodyMediumExtraBold" color="grey.600">
          Contact
        </Typography>
        <Controller
          name="contact"
          control={control}
          render={({ field }) => (
            <SearchInput
              {...field}
              open={openContactSearch}
              onOpen={handleOpen}
              onClose={handleClose}
              options={options}
              loading={loading.input}
              placeholder="Search contacts..."
              error={!!errors.contact}
              helperText={errors.contact?.message}
            />
          )}
        />
        <Box display="flex" justifyContent="end">
          <CommonButton
            sx={{ width: "50%", float: "right" }}
            text="Add new contact"
            onClick={() => setOpenDialog(true)}
            startIcon={<img src={addIcon} alt="" />}
          />
        </Box>
        <Typography variant="bodyMediumExtraBold" color="grey.600">
          Date
        </Typography>
        <Controller
          name="date"
          control={control}
          render={({ field }) => (
            <DateInput
              {...field}
              label=""
              shouldDisableDate={shouldDisableDate}
              error={!!errors.date || shouldDisableDate(selectedDate)}
              helperText={
                errors.date?.message ||
                (shouldDisableDate(selectedDate) ? "Date not available" : "")
              }
            />
          )}
        />
        <Typography variant="bodyMediumExtraBold" color="grey.600">
          Start Time
        </Typography>
        <Controller
          name="startTime"
          control={control}
          render={({ field }) => (
            <CommonTextField {...field} fullWidth disabled />
          )}
        />
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography variant="bodyMediumExtraBold" color="grey.600">
            Length
          </Typography>
          <img src={questionMark} alt="" />
        </Box>
        <Controller
          name="length"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              select
              fullWidth
              error={!!errors.length}
              helperText={errors.length?.message}
            >
              <MenuItem value="15">15 minutes</MenuItem>
              <MenuItem value="30">30 minutes</MenuItem>
              <MenuItem value="45">45 minutes</MenuItem>
              <MenuItem value="60">60 minutes</MenuItem>
            </CommonTextField>
          )}
        />
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography variant="bodyMediumExtraBold" color="grey.600">
            Appointment Type
          </Typography>
          <img src={questionMark} alt="" />
        </Box>
        <Controller
          name="appointmentType"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              select
              fullWidth
              error={!!errors.appointmentType}
              helperText={errors.appointmentType?.message}
            >
              <MenuItem value="inPerson">In Person</MenuItem>
              <MenuItem value="phoneCall">Phone Call</MenuItem>
            </CommonTextField>
          )}
        />
        <Box display="flex" alignItems="center" gap={0.5}>
          <Typography variant="bodyMediumExtraBold" color="grey.600">
            Reason for Call
          </Typography>
          <img src={questionMark} alt="" />
        </Box>
        <Controller
          name="reasonForCall"
          control={control}
          render={({ field }) => (
            <CommonTextField
              {...field}
              fullWidth
              multiline
              rows={3}
              placeholder="Add reason for call"
              error={!!errors.reasonForCall}
              helperText={errors.reasonForCall?.message}
            />
          )}
        />
      </Box>
      <AddContact openDialog={openDialog} setOpenDialog={setOpenDialog} />
      
      {/* Add contact */}
      {/* <CommonDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          reset();
        }}
        confirmButtonType="primary"
        title="New Contact"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        <Typography variant="bodyMediumExtraBold" color="grey.600">
          First Name
        </Typography>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => <CommonTextField {...field} fullWidth />}
        />

        <Typography variant="bodyMediumExtraBold" color="grey.600">
          Last Name
        </Typography>
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => <CommonTextField {...field} fullWidth />}
        />

        <Typography variant="bodyMediumExtraBold" color="grey.600">
          Email
        </Typography>
        <Controller
          name="email"
          control={control}
          render={({ field }) => <CommonTextField {...field} fullWidth />}
        />

        <Typography variant="bodyMediumExtraBold" color="grey.600">
          Phone
        </Typography>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => <CommonTextField {...field} fullWidth />}
        />
      </CommonDialog> */}
    </>
  );
};

export default SlotBookingForm;
