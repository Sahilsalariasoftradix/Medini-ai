import { Box, Typography } from "@mui/material";
import OTPInput from "../../common/CommonOtp";
import CommonButton from "../../common/CommonButton";
import { useAppointmentChecker } from "../../../store/AppointmentCheckerContext";
import { useState } from "react";

const OtpReceiver = () => {
  const { setStep, step } = useAppointmentChecker();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setError(false); // Clear error when user starts typing
  };

  const handleProceed = () => {
    if (!otp.trim() || otp.length != 5) {
      setError(true);
      return;
    }
    setStep(step + 1);
  };
  return (
    <Box>
      <Typography
        my={2}
        sx={{ fontSize: { xs: 24, md: 28 } }}
        align="center"
        variant="h3"
      >
        Enter the OTP sent to your phone
      </Typography>
      <Box my={4} display={"flex"} justifyContent={"center"}>
        <OTPInput value={otp} onChange={handleOtpChange} error={error} />
      </Box>
      {error && (
        <Typography align="center" color="error" variant="bodyMediumExtraBold">
          Please enter the OTP before proceeding.
        </Typography>
      )}

      <Typography
        align="center"
        my={2}
        variant="bodyMediumExtraBold"
        color="grey.600"
      >
        Didn't receive the OTP?
      </Typography>
      <Typography
        align="center"
        my={2}
        variant="bodyMediumExtraBold"
        color="grey.600"
      >
        Resend OTP
      </Typography>
      <Box display={"flex"} gap={2} pt={2} pb={3}>
        <CommonButton
          fullWidth
          text="Back"
          variant="contained"
          color="secondary"
          onClick={() => setStep(step - 1)}
        />
        <CommonButton
          type="submit"
          text="Proceed"
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleProceed}
          disabled={!otp.trim()} // Disable if OTP is empty
        />
      </Box>
    </Box>
  );
};

export default OtpReceiver;
