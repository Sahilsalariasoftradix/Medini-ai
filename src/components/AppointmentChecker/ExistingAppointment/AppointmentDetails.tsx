import { Box, Typography } from "@mui/material";
import { availabilityIcons, EditFormIcon } from "../../../utils/Icons";
import CommonButton from "../../common/CommonButton";
import {
  ExistingAppointmentData,
  useAppointmentChecker,
} from "../../../store/AppointmentCheckerContext";

const AppointmentDetails = () => {
  const { setStep, step, setExistingAppointmentData, setExistingPhone } =
    useAppointmentChecker();
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
      <Box mb={2}>
        <Box display={"flex"} justifyContent={"space-between"}>
          <Typography variant="bodyMediumExtraBold">
            Your Appointment
          </Typography>
          <Box
            onClick={() => setStep(step + 1)}
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
          <Typography variant="bodySmallMedium">Dr J, Johnson</Typography>
        </Box>
        <Box display={"flex"} mt={2} justifyContent={"space-between"}>
          <Typography variant="bodyLargeMedium" color="grey.600">
            Clinic
          </Typography>
          <Box>
            <Typography align="right" variant="bodySmallMedium">
              Surgery Name
            </Typography>
            <Typography align="right" variant="bodySmallMedium">
              9662 Runte Fields
            </Typography>
            <Typography align="right" variant="bodySmallMedium">
              Port Eugene 44128
            </Typography>
            <Typography align="right" variant="bodySmallMedium">
              Canada
            </Typography>
            <Typography align="right" variant="bodySmallMedium">
              (651) 522-3704 x8807
            </Typography>
          </Box>
        </Box>
        <Box display={"flex"} mt={2} justifyContent={"space-between"}>
          <Typography variant="bodyLargeMedium" color="grey.600">
            Date
          </Typography>
          <Typography align="right" variant="bodySmallMedium">
            Tue 05/02/2025
          </Typography>
        </Box>
        <Box display={"flex"} mt={2} justifyContent={"space-between"}>
          <Typography variant="bodyLargeMedium" color="grey.600">
            Length
          </Typography>
          <Typography align="right" variant="bodySmallMedium">
            15 min
          </Typography>
        </Box>
        <Box display={"flex"} mt={2} justifyContent={"space-between"}>
          <Typography variant="bodyLargeMedium" color="grey.600">
            Appointment Type
          </Typography>
          <Box display={"flex"} gap={1} alignItems={"center"}>
            <img src={`${availabilityIcons.phone}`} alt="phone" />
            <Typography align="right" variant="bodySmallMedium">
              Phone
            </Typography>
          </Box>
        </Box>
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
    </Box>
  );
};

export default AppointmentDetails;
