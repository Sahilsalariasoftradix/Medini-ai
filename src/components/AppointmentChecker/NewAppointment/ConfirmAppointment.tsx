import { Box, Typography, Divider, CircularProgress } from "@mui/material";
import { useAppointmentChecker } from "../../../store/AppointmentCheckerContext";
import CommonButton from "../../common/CommonButton";
import { format } from "date-fns";
import { useState } from "react";
import { availabilityIcons, EditFormIcon } from "../../../utils/Icons";
import StepProgress from "../StepProgress";
import { EnBookingType, EnStepProgress } from "../../../utils/enums";
import { createBooking, sendVerificationCode } from "../../../api/userApi";
import dayjs from "dayjs";
import CommonSnackbar from "../../common/CommonSnackbar";
import CommonDialog from "../../common/CommonDialog";
import OtpReceiver from "../ExistingAppointment/OtpReceiver";

const ConfirmAppointment = () => {
  const { step, setStep, newAppointmentData, setReferenceNumber, startTimer, isResendDisabled, timer } =
    useAppointmentChecker();

  const [submitting, setSubmitting] = useState(false);
  const { snackbar, setSnackbar } = useAppointmentChecker();
  const [confirmPopup, setConfirmPopup] = useState(false);
  const sendCode = async () => {
    setSubmitting(true);
    try {
      // Only send code and start timer if the timer isn't already running
      if (!isResendDisabled || timer === 0) {
        await sendVerificationCode(
          newAppointmentData?.phone || "",
          newAppointmentData?.firstName || ""
        );
        setSnackbar({
          open: true,
          message: "Verification code sent successfully",
          severity: "success",
        });
        startTimer();
      }
      setConfirmPopup(true);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message as string,
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };
  const submitBookingData = async () => {
    setSubmitting(true);
    try {
      // Convert time string (e.g., "14:30") to Date object
      const timeArray = newAppointmentData?.time?.split(":").map(Number) || [
        0, 0,
      ];
      const [hours, minutes] = timeArray;
      const startTime = new Date(newAppointmentData?.day || new Date());
      startTime.setHours(hours, minutes, 0, 0); // Set start time

      // Add appointment length (in minutes)
      const endTime = new Date(startTime);
      endTime.setMinutes(
        endTime.getMinutes() + Number(newAppointmentData?.appointmentLength)
      );

      const payload = {
        //@ts-ignore
        user_id: newAppointmentData?.practitioner?.id,
        date: dayjs(newAppointmentData?.day).format("YYYY-MM-DD"),
        start_time: newAppointmentData?.time,
        end_time: `${endTime.getHours()}:${String(
          endTime.getMinutes()
        ).padStart(2, "0")}`, // Format as HH:mm
        details: newAppointmentData?.details,
        booking_type: newAppointmentData?.appointmentType,
        email: newAppointmentData?.email,
        first_name: newAppointmentData?.firstName,
        last_name: newAppointmentData?.lastName,
        phone: newAppointmentData?.phone,
      };

      //@ts-ignore
      const resp = await createBooking(payload);
      setReferenceNumber(resp.booking_id);
      setTimeout(() => {
        setStep(step + 1);
      }, 500);
      setSnackbar({
        open: true,
        message: "Appointment created successfully",
        severity: "success",
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message as string,
        severity: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Format date and time for display
  const formattedDate = newAppointmentData?.day
    ? format(new Date(newAppointmentData.day), "MMMM dd, yyyy")
    : "Not selected";

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

      {/* <Box display={"flex"} mt={2} justifyContent={"space-between"}>
        <Typography variant="bodySmallMedium" color="grey.600">
          DOB:
        </Typography>
        <Typography variant="bodySmallMedium">
          {newAppointmentData?.dateOfBirth || "N/A"}
        </Typography>
      </Box> */}

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
          {(newAppointmentData?.practitioner as { name?: string })?.name ||
            "N/A"}
        </Typography>
      </Box>
      <Box display={"flex"} mt={2} justifyContent={"space-between"}>
        <Typography variant="bodySmallMedium" color="grey.600">
          Clinic:
        </Typography>
        <Typography variant="bodySmallMedium">
          {(newAppointmentData?.businessName as { name?: string })?.name ||
            "N/A"}
        </Typography>
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
            {newAppointmentData?.appointmentType === EnBookingType.PHONE
              ? "Phone"
              : "In Person"}
          </Typography>
        </Box>
      </Box>

      <Box display={"flex"} mt={2} justifyContent={"space-between"}>
        <Typography variant="bodySmallMedium" color="grey.600">
          Appointment Length:
        </Typography>
        <Typography variant="bodySmallMedium">
          {newAppointmentData?.appointmentLength || "N/A"} mins
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
          onClick={() => {
            sendCode();
          }}
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
      <CommonDialog
        open={confirmPopup}
        cancelText=""
        onClose={() => {
          setConfirmPopup(false);
        }}
        styles={{
          borderRadius: "50px",
        }}
      >
        <OtpReceiver
          phoneNumber={newAppointmentData?.phone || ""}
          required={true}
          closePopup={() => setConfirmPopup(false)}
          resendCode={() => sendCode()}
          onSuccessfulVerification={() => {
            setConfirmPopup(false);
            submitBookingData();
          }}
        />
      </CommonDialog>
      <CommonSnackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        severity={snackbar.severity}
      />
    </Box>
  );
};

export default ConfirmAppointment;
