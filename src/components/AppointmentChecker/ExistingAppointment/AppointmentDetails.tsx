import { Box, Typography } from "@mui/material";
import { EditFormIcon } from "../../../utils/Icons";
import CommonButton from "../../common/CommonButton";
import {
  ExistingAppointmentData,
  useAppointmentChecker,
} from "../../../store/AppointmentCheckerContext";
import { formatDate } from "../../../utils/common";

const AppointmentDetails = () => {
  const {
    setStep,
    step,
    setExistingAppointmentData,
    setExistingPhone,
    userBookings,
    existingAppointmentData,
    setSelectedBookingId,
  } = useAppointmentChecker();

  return (
    <Box>
      <Typography
        align="center"
        variant="h3"
        my={2}
        sx={{ fontSize: { xs: 24, md: 28 } }}
      >
        Appointment Details
      </Typography>
      <Typography
        align="center"
        variant="bodyLargeMedium"
        sx={{ mb: 5 }}
        color="grey.600"
      >
        We found your appointment! You can edit your details or request changes
        to the appointment below.
      </Typography>
      {userBookings?.map((booking) => (
        <Box
          key={booking.id}
          mb={2}
          sx={{
            border: "1px solid #E0E0E0",
            borderRadius: "50px",
            padding: "10px",
            boxShadow: "0px 0px 10px 0px rgba(0, 0, 0, 0.1)",
            p: 4,
          }}
        >
          <Box display={"flex"} justifyContent={"end"}>
            {/* <Typography variant="bodyMediumExtraBold">
            Your Appointment
          </Typography> */}
            <Box
              onClick={() => {
                setSelectedBookingId(booking.booking_id);
                setStep(step + 1);
              }}
              sx={{
                cursor: "pointer",
                display: "flex",
                gap: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <EditFormIcon />

              <Typography variant="bodySmallSemiBold" color="primary.main">
                Edit
              </Typography>
            </Box>
          </Box>
          <Box display={"flex"} mt={2} justifyContent={"space-between"}>
          <Typography variant="bodyLargeMedium" color="grey.600">
            Practitioner
          </Typography>
          <Typography variant="bodyLargeMedium">{booking?.user_first_name} {booking?.user_last_name}</Typography>
        </Box>
          <Box display={"flex"} mt={2} justifyContent={"space-between"}>
            <Typography variant="bodyLargeMedium" color="grey.600">
              Clinic
            </Typography>
            <Box>
              <Typography align="right" variant="bodyLargeMedium">
                {existingAppointmentData?.appointment_location?.name}
              </Typography>
              {/* <Typography align="right" variant="bodyLargeMedium">
              9662 Runte Fields
            </Typography>
            <Typography align="right" variant="bodyLargeMedium">
              Port Eugene 44128
            </Typography>
            <Typography align="right" variant="bodyLargeMedium">
              Canada
            </Typography>
            <Typography align="right" variant="bodyLargeMedium">
              (651) 522-3704 x8807
            </Typography> */}
            </Box>
          </Box>
          <Box display={"flex"} mt={2} justifyContent={"space-between"}>
            <Typography variant="bodyLargeMedium" color="grey.600">
              Date
            </Typography>
            <Typography align="right" variant="bodyLargeMedium">
              {formatDate(booking?.date)}
            </Typography>
          </Box>
          <Box display={"flex"} mt={2} justifyContent={"space-between"}>
            <Typography variant="bodyLargeMedium" color="grey.600">
              Appointment Length
            </Typography>
            <Typography align="right" variant="bodyLargeMedium">
              {booking?.start_time.slice(0, 5)} -{" "}
              {booking?.end_time.slice(0, 5)}
            </Typography>
          </Box>
          {/* <Box display={"flex"} mt={2} justifyContent={"space-between"}>
          <Typography variant="bodyLargeMedium" color="grey.600">
            Appointment Type
          </Typography>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <img src={`${availabilityIcons.phone}`} alt="phone" />
            <Typography align="right" variant="bodyLargeMedium">
              Phone
            </Typography>
          </Box>
        </Box> */}
        </Box>
      ))}
      <Box display={"flex"} gap={2} mt={4}>
        <CommonButton
          fullWidth
          text="Back"
          variant="contained"
          color="secondary"
          onClick={() => setStep(step - 1)}
        />
        <CommonButton
          text="Ok"
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => {
            setStep(step - 3);
            setExistingAppointmentData({} as ExistingAppointmentData);
            setExistingPhone("");
          }}
        />
      </Box>
    </Box>
  );
};

export default AppointmentDetails;
