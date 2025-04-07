import React, { useEffect } from "react";
import { useAppointmentChecker } from "../../store/AppointmentCheckerContext";
import { Box, Typography, BoxProps } from "@mui/material";
interface AppointmentCheckerProps extends BoxProps {
  children: React.ReactNode;
  className?: string;
}
// Step components
import NewAppointmentStep1 from "./NewAppointment/NewAppointmentStep1";
import NewAppointmentStep2 from "./NewAppointment/NewAppointmentStep2";
import ConfirmAppointment from "./NewAppointment/ConfirmAppointment";
import AppointmentBooked from "./NewAppointment/AppointmentBooked";
import ExistingAppointment from "./ExistingAppointment/ExistingAppointment";
import AppointmentDetails from "./ExistingAppointment/AppointmentDetails";
import EditAppointment from "./ExistingAppointment/EditAppointment";

import CommonButton from "../common/CommonButton";
import OtpReceiver from "./ExistingAppointment/OtpReceiver";
import StepFormLayout from "../StepForm/StepFormLayout";
import { getCustomerBookings, sendVerificationCode } from "../../api/userApi";
import CommonSnackbar from "../common/CommonSnackbar";

const AppointmentChecker: React.FC<AppointmentCheckerProps> = () => {
  const {
    step,
    setStep,
    flowType,
    setFlowType,
    hasAppointment,
    setHasAppointment,
    existingPhone,
    existingAppointmentData,
    setUserBookings,
    userBookings,
    // resetAppointmentData,
    startTimer,
  } = useAppointmentChecker();
  console.log(userBookings, "bookings");

  const { snackbar, setSnackbar } = useAppointmentChecker();

  useEffect(() => {
    if (hasAppointment === true) {
      setFlowType("existing");
      setStep(2);
    } else if (hasAppointment === false) {
      setFlowType("new");
      setStep(2);
    } else {
      setFlowType("new");
      setStep(1);
    }
  }, [hasAppointment]);

  const sendCode = async () => {
    try {
      await sendVerificationCode(
        existingPhone,
        existingAppointmentData?.email || ""
      );
      setSnackbar({
        open: true,
        message: "Verification code sent successfully",
        severity: "success",
      });
      startTimer();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message as string,
        severity: "error",
      });
    }
  };
  const renderInitialQuestion = () => (
    <Box>
      <Typography
        align="center"
        variant="h3"
        my={2}
        sx={{ fontSize: { xs: 24, md: 28 } }}
      >
        Do You Have an <br /> Appointment?
      </Typography>
      <Typography variant="bodyLargeMedium" sx={{ mb: 5 }} color="grey.600">
        Let's start by checking your appointment status.
      </Typography>

      <Box display={"flex"} gap={2} pb={2}>
        <CommonButton
          fullWidth
          text="No, I need one"
          variant="contained"
          color="secondary"
          onClick={() => setHasAppointment(false)}
        />
        <CommonButton
          text="Yes, I have one"
          fullWidth
          variant="contained"
          color="primary"
          onClick={() => {
            setHasAppointment(true);
            setStep(2);
          }}
        />
      </Box>
    </Box>
  );

  const renderContent = () => {
    // Initial question screen
    if (step === 1) {
      return renderInitialQuestion();
    }

    // New appointment flow
    if (flowType === "new") {
      switch (step) {
        case 2:
          return <NewAppointmentStep1 />;
        case 3:
          return <NewAppointmentStep2 />;
        case 4:
          return <ConfirmAppointment />;
        case 5:
          return <AppointmentBooked />;
        default:
          return null;
      }
    }

    // Existing appointment flow
    if (flowType === "existing") {
      switch (step) {
        case 2:
          return <ExistingAppointment />;
        case 3:
          return (
            <OtpReceiver
              phoneNumber={existingPhone}
              required={false}
              closePopup={() => {}}
              resendCode={() => {
                sendCode();
              }}
              onSuccessfulVerification={() => {
                getCustomerBookings(
                  Number(existingAppointmentData?.appointment_location),
                  existingPhone
                ).then((bookings) => {
                  setUserBookings(bookings);
                  setStep(4);
                });
              }}
            />
          );
        case 4:
          return <AppointmentDetails />;
        case 5:
          return <EditAppointment />;
        default:
          return null;
      }
    }

    return null;
  };

  return (
    <Box
      sx={{
        bgcolor: "grey.200",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <StepFormLayout>{renderContent()}</StepFormLayout>
      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() =>
          setSnackbar({ open: false, message: "", severity: "success" })
        }
      />
    </Box>
  );
};

export default AppointmentChecker;
