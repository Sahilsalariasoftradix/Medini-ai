import { Box, Typography, Divider, CircularProgress } from "@mui/material";
import { useAppointmentChecker } from "../../../store/AppointmentCheckerContext";
import CommonButton from "../../common/CommonButton";
import { format } from "date-fns";
import { useState } from "react";
import { availabilityIcons, EditFormIcon } from "../../../utils/Icons";
import StepProgress from "../StepProgress";
import { EnStepProgress } from "../../../utils/enums";

const ConfirmAppointment = () => {
  const { step, setStep, newAppointmentData } = useAppointmentChecker();
  const [submitting, setSubmitting] = useState(false);

  const handleConfirm = () => {
    setSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      // Submit appointment data here to your API
      // Then navigate to the AppointmentBooked screen
      setSubmitting(false);
      setStep(step + 1);
    }, 1500);
  };

  // Format date and time for display
  const formattedDate = newAppointmentData?.date
    ? format(new Date(newAppointmentData.date), "MMMM dd, yyyy")
    : "Not selected";

  //   const formattedTime = newAppointmentData?.time
  //     ? format(new Date(newAppointmentData.time), "h:mm a")
  //     : "Not selected";

  return (
    <Box>
      <Typography
        align="center"
        variant="h3"
        my={2}
        sx={{ fontSize: { xs: 24, md: 28 } }}
      >
        Confirm Appointment
      </Typography>
      <Typography variant="bodyLargeMedium" color="grey.600">
        Please review your appointment details carefully.
      </Typography>

      <Box display={"flex"} mt={4} mb={2} justifyContent={"space-between"}>
        <Typography variant="bodyMediumExtraBold">Contact</Typography>
        <Box
          onClick={() => setStep(step - 2)}
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
      <Box display={"flex"} justifyContent={"space-between"}>
        <Typography variant="bodySmallMedium" color="grey.600">
          Name:
        </Typography>
        <Typography variant="bodySmallExtraBold">
          {newAppointmentData?.firstName || "N/A"}{" "}
          {newAppointmentData?.lastName || "N/A"}
        </Typography>
      </Box>

      <Box display={"flex"} mt={2} justifyContent={"space-between"}>
        <Typography variant="bodySmallMedium" color="grey.600">
          Email:
        </Typography>
        <Typography variant="bodySmallMedium">
          {newAppointmentData?.email || "N/A"}
        </Typography>
      </Box>

      <Box display={"flex"} mt={2} justifyContent={"space-between"}>
        <Typography variant="bodySmallMedium" color="grey.600">
          Phone:
        </Typography>
        <Typography variant="bodySmallMedium">
          {newAppointmentData?.phone || "N/A"}
        </Typography>
      </Box>

      <Box display={"flex"} mt={2} justifyContent={"space-between"}>
        <Typography variant="bodySmallMedium" color="grey.600">
          DOB:
        </Typography>
        <Typography variant="bodySmallMedium">
          {newAppointmentData?.dateOfBirth || "N/A"}
        </Typography>
      </Box>

      <Divider sx={{ my: 1 }} />
      <Box display={"flex"} mt={4} mb={2} justifyContent={"space-between"}>
        <Typography variant="bodyMediumExtraBold">Your Appointment</Typography>

        <Box
          onClick={() => setStep(step - 1)}
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
        <Typography variant="bodySmallMedium" color="grey.600">
          Practitioner:
        </Typography>
        <Typography variant="bodySmallMedium">
          {newAppointmentData?.practitioner || "N/A"}
        </Typography>
      </Box>
      <Box display={"flex"} mt={2} justifyContent={"space-between"}>
        <Typography variant="bodySmallMedium" color="grey.600">
          Clinic:
        </Typography>
        <Typography variant="bodySmallMedium">{"None"}</Typography>
      </Box>

      <Box display={"flex"} mt={2} justifyContent={"space-between"}>
        <Typography variant="bodySmallMedium" color="grey.600">
          Date:
        </Typography>
        <Typography variant="bodySmallMedium">{formattedDate}</Typography>
      </Box>

      {/* <Box display={"flex"} mt={2} justifyContent={"space-between"}>
        <Typography variant="bodySmallMedium" color="grey.600">
          Time:
        </Typography>
        <Typography variant="bodySmallMedium">{formattedTime}</Typography>
      </Box> */}

      <Box display={"flex"} mt={2} justifyContent={"space-between"}>
        <Typography variant="bodySmallMedium" color="grey.600">
          Appointment Type:
        </Typography>
        <Box
          display="flex"
          gap={1}
          justifyContent="start"
          alignItems={"center"}
        >
          <img
            src={
              newAppointmentData?.appointmentType === "phone"
                ? availabilityIcons.phone
                : availabilityIcons.in_person
            }
            alt=""
          />
          <Typography variant="bodySmallMedium">
            {newAppointmentData?.appointmentType || "N/A"}
          </Typography>
        </Box>
      </Box>

      <Box display={"flex"} mt={2} justifyContent={"space-between"}>
        <Typography variant="bodySmallMedium" color="grey.600">
          Appointment Length:
        </Typography>
        <Typography variant="bodySmallMedium">
          {newAppointmentData?.appointmentLength || "N/A"}
        </Typography>
      </Box>

      <Box my={4} display="flex" gap={2}>
        <CommonButton
          text="Back"
          variant="contained"
          color="secondary"
          fullWidth
          onClick={() => {
            // Navigate back to previous step
            setStep(step - 1);
          }}
          disabled={submitting}
        />
        <CommonButton
          text={submitting ? "Processing..." : "Confirm Appointment"}
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleConfirm}
          disabled={submitting}
          startIcon={
            submitting ? <CircularProgress size={20} color="inherit" /> : null
          }
        >
          {submitting ? "Processing..." : "Confirm Appointment"}
        </CommonButton>
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

export default ConfirmAppointment;
