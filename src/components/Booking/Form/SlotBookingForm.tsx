import { Controller } from "react-hook-form";
import { Box, Divider, MenuItem, Typography } from "@mui/material";

import addIcon from "../../../assets/icons/add-icn.svg";
import questionMark from "../../../assets/icons/question.svg";
import SearchInput from "../../common/SearchInput";
import CommonButton from "../../common/CommonButton";
import DateInput from "../../common/DateInput";
import CommonTextField from "../../common/CommonTextField";
import dayjs, { Dayjs } from "dayjs";
import { IFilm, IGetContacts } from "../../../utils/Interfaces";
import { useEffect, useState } from "react";

import AddContact from "./AddContact";
import { getContacts } from "../../../firebase/AuthService";

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
  loading,
  shouldDisableDate,
  selectedDate,
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [contacts, setContacts] = useState<IGetContacts>([]);

  const fetchContacts = async () => {
    const contactList = await getContacts();
    setContacts(contactList);
  };
  useEffect(() => {
    fetchContacts();
  }, []);

  const contactOptions = contacts.map((contact) => ({
    title: `${contact.firstName} ${contact.lastName}`,
    key: `${contact.firstName}-${contact.lastName}-${contact.email}`, // Unique key
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
  }));
  

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
              options={contactOptions}
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
      {/* Add contact */}
      <AddContact
        fetchContacts={fetchContacts}
        openDialog={openDialog}
        setOpenDialog={setOpenDialog}
      />
    </>
  );
};

export default SlotBookingForm;
