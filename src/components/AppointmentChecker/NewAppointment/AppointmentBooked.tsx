import { Box, Typography } from "@mui/material";
import {
  NewAppointmentData,
  useAppointmentChecker,
} from "../../../store/AppointmentCheckerContext";
import CommonButton from "../../common/CommonButton";
import { format } from "date-fns";
import { availabilityIcons } from "../../../utils/Icons";
import StepProgress from "../StepProgress";
import { EnStepProgress } from "../../../utils/enums";

const AppointmentBooked = () => {
  const {
    setStep,
    appointmentData,
    setNewAppointmentData,
    setPhone,
    setFlowType,
    setHasAppointment,
    step,
  } = useAppointmentChecker();

  // Format date and time for display
  //@ts-ignore
  const formattedDate = appointmentData?.date
    ? //@ts-ignore
      format(new Date(appointmentData.date), "MMMM dd, yyyy")
    : "Not selected";
  //@ts-ignore
  const formattedTime = appointmentData?.time
    ? //@ts-ignore
      format(new Date(appointmentData.time), "h:mm a")
    : "Not selected";

  return (
    <Box sx={{ maxWidth: "400px" }}>
      <Typography
        align="center"
        variant="h3"
        mb={2}
        sx={{ fontSize: { xs: 24, md: 28 } }}
      >
        Appointment Booked
      </Typography>

      <Typography
        align="center"
        variant="bodyLargeMedium"
        sx={{ mb: 3 }}
        color="grey.600"
      >
        You're all set!
      </Typography>
      <Typography
        align="center"
        variant="bodyLargeMedium"
        sx={{ mb: 3 }}
        color="grey.600"
      >
        Your appointment is successfully scheduled. Here's your confirmation
        number
      </Typography>
      <Typography
        align="center"
        variant="h3"
        mb={2}
        sx={{ fontSize: { xs: 24, md: 28 } }}
      >
        1452
      </Typography>
      <Box display="flex" gap={2} justifyContent="start" alignItems={"center"}>
        <Typography variant="bodySmallMedium" color="grey.600">
          With
        </Typography>
        <Typography variant="bodySmallMedium">Dr J, Johnson</Typography>
      </Box>
      <Box
        display="flex"
        gap={2}
        mt={2}
        justifyContent="start"
        alignItems={"start"}
      >
        <Typography variant="bodySmallMedium" color="grey.600">
          At
        </Typography>
        <Box>
          <Typography variant="bodySmallMedium">Surgery Name</Typography>
          <Typography variant="bodySmallMedium">9262 Runte St</Typography>
          <Typography variant="bodySmallMedium">San Francisco</Typography>
          <Typography variant="bodySmallMedium">Canada</Typography>
          <Typography variant="bodySmallMedium">
            (651) 522-3704 x8807
          </Typography>
        </Box>
      </Box>
      <Box
        display="flex"
        mt={2}
        gap={2}
        justifyContent="start"
        alignItems={"center"}
      >
        <Typography variant="bodySmallMedium" color="grey.600">
          Date
        </Typography>
        <Typography variant="bodySmallMedium">Tue 05/02/2025</Typography>
      </Box>
      <Box
        display="flex"
        mt={2}
        gap={2}
        justifyContent="start"
        alignItems={"center"}
      >
        <Typography variant="bodySmallMedium" color="grey.600">
          Length
        </Typography>
        <Typography variant="bodySmallMedium">15 min</Typography>
      </Box>
      <Box
        display="flex"
        mt={2}
        gap={2}
        justifyContent="start"
        alignItems={"center"}
      >
        <Typography variant="bodySmallMedium" color="grey.600">
          Appointment Type
        </Typography>
        <Box
          display="flex"
          gap={1}
          justifyContent="start"
          alignItems={"center"}
        >
          <img src={availabilityIcons.phone} alt="" />
          <Typography variant="bodySmallMedium">Phone</Typography>
        </Box>
      </Box>
      <Box my={4} display="flex" justifyContent="center">
        <CommonButton
          text="Ok"
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => {
            // Reset to first step or home page
            setStep(1);
            setNewAppointmentData({} as NewAppointmentData);
            setPhone("");
            setFlowType(null);
            setHasAppointment(null);
          }}
        />
      </Box>
      <Box display="flex" justifyContent="center" mt={2}>
        <StepProgress
          currentStep={step - 1}
          totalSteps={EnStepProgress.TOTAL_STEPS}
        />
      </Box>
    </Box>
  );
};

export default AppointmentBooked;
