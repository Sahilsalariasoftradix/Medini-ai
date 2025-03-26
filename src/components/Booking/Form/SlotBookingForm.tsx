import { Controller } from "react-hook-form";
import { Box, Divider, MenuItem, Typography } from "@mui/material";

import addIcon from "../../../assets/icons/add-icn.svg";
import questionMark from "../../../assets/icons/question.svg";
import SearchInput from "../../common/SearchInput";
import CommonButton from "../../common/CommonButton";
import CommonTextField from "../../common/CommonTextField";
import { IGetContacts, ISlotBookingFormProps } from "../../../utils/Interfaces";
import { useEffect, useState } from "react";

import AddContact from "./AddContact";
import { getContactsByUserId } from "../../../firebase/AuthService";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { datePickerIcons } from "../../../utils/Icons";
import { useAuth } from "../../../store/AuthContext";
import dayjs from "dayjs";

export const calenderIcon = () => <img src={datePickerIcons.calendar} alt="" />;
const SlotBookingForm: React.FC<ISlotBookingFormProps> = ({
  control,
  errors,
  openContactSearch,
  handleOpen,
  handleClose,
  loading,
  // shouldDisableDate,
  selectedDate,
  isEditing,
}) => {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [contacts, setContacts] = useState<IGetContacts>([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const { userDetails } = useAuth();
  const fetchContacts = async () => {
    const contactList = await getContactsByUserId(userDetails?.user_id);
    setContacts(contactList);
  };
  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    // Get the current contact value from the form
    const currentValue = control._formValues?.contact;
    if (currentValue && Object.keys(currentValue).length > 0) {
      setSelectedContact(currentValue);
    }
  }, [control._formValues?.contact]);

  const contactOptions = contacts.map((contact) => ({
    title: `${contact.firstName} ${contact.lastName}`,
    key: `${contact.firstName}-${contact.lastName}-${contact.phone}`,
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
              // key={selectedContact?.phone}
              onOpen={handleOpen}
              onClose={handleClose}
              setSelectedContact={setSelectedContact}
              options={contactOptions}
              loading={loading.input}
              placeholder="Search contacts..."
              error={!!errors.contact}
              helperText={errors.contact?.phone?.message}
              // disabled={isEditing}
              value={selectedContact}
              isEditing={isEditing}
              defaultValue={selectedContact}
              getOptionLabel={(option) =>
                `${option.firstName} ${option.lastName}`
              }
            />
          )}
        />
        {!isEditing && (
          <Box display="flex" justifyContent="end">
            <CommonButton
              sx={{ width: "50%", float: "right" }}
              text="Add new contact"
              onClick={() => setOpenDialog(true)}
              startIcon={<img src={addIcon} alt="" />}
            />
          </Box>
        )}
        <Typography variant="bodyMediumExtraBold" color="grey.600">
          Date
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Controller
            name="date"
            control={control}
            render={({ field: { onChange, ...field } }) => (
              <DatePicker
                // disabled
                slotProps={{
                  day: {
                    sx: {
                      "&.MuiPickersDay-root.Mui-selected": {
                        backgroundColor: "#FF4747",
                      },
                    },
                  },
                }}
                {...field}
                value={selectedDate}
                onChange={(newValue) => {
                  onChange(newValue);
                }}
                shouldDisableDate={(date) => date.isBefore(dayjs(), "day")}
                // slotProps={{
                //   field: {
                //     readOnly: true,
                //   },
                // }}

                slots={{ openPickerIcon: calenderIcon }}
                label=""
                // shouldDisableDate={shouldDisableDate}
              />
            )}
          />
        </LocalizationProvider>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Typography variant="bodyMediumExtraBold" color="grey.600">
            Start Time
          </Typography>

          <Controller
            name="startTime"
            control={control}
            render={({ field: { onChange, value } }) => (
              <TimePicker
                minutesStep={15}
                ampm={false} // 24-hour format
                value={value ? dayjs(value, "HH:mm") : null} // Convert string to dayjs
                onChange={(newValue) => {
                  onChange(newValue ? newValue.format("HH:mm") : null); // Convert dayjs back to string
                }}
                slotProps={{ textField: { fullWidth: true } }}
              />
            )}
          />
        </LocalizationProvider>

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
              disabled={isEditing}
              value={isEditing ? "15" : "15"}
            >
              <MenuItem value="15">15 minutes</MenuItem>
              {/* <MenuItem value="30">30 minutes</MenuItem>
              <MenuItem value="45">45 minutes</MenuItem>
              <MenuItem value="60">60 minutes</MenuItem> */}
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
            Reason for Appointment
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
              placeholder="Add reason for appointment"
              error={!!errors.reasonForCall}
              helperText={errors.reasonForCall?.message}
            />
          )}
        />
      </Box>
      {!isEditing && (
        <AddContact
          fetchContacts={fetchContacts}
          openDialog={openDialog}
          setOpenDialog={setOpenDialog}
        />
      )}
    </>
  );
};

export default SlotBookingForm;
