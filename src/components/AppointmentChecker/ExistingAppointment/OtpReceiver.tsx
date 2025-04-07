import { Box, Typography } from "@mui/material";
import OTPInput from "../../common/CommonOtp";
import CommonButton from "../../common/CommonButton";
import { useAppointmentChecker } from "../../../store/AppointmentCheckerContext";
import { useState } from "react";
import { verifyVerificationCode } from "../../../api/userApi";

const OtpReceiver = ({
  phoneNumber,
  required,
  // closePopup,
  resendCode,
  onSuccessfulVerification,
}: {
  phoneNumber: string;
  required: boolean;
  closePopup: () => void;
  resendCode: () => void;
  onSuccessfulVerification?: () => void;
}) => {
  const { setStep, step } = useAppointmentChecker();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { timer, isResendDisabled } =
    useAppointmentChecker();

  const handleOtpChange = (value: string) => {
    setOtp(value);
    setError(false); // Clear error when user starts typing
  };



  const verifyCode = async () => {
    setLoading(true);
    try {
      await verifyVerificationCode(phoneNumber, otp);
      setSuccess(true);

      if (onSuccessfulVerification) {
        onSuccessfulVerification();
      }
    } catch (error: any) {
      setError(true);
      setErrorMessage(error.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };
  const sendAgain = async () => {
    setLoading(true);
    setSuccess(false);
    resendCode();
    setOtp("");
    setErrorMessage("");
    setLoading(false);
  };
  const handleProceed = () => {
    if (!otp.trim() || otp.length != 6) {
      setError(true);
      return;
    }
    verifyCode();
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
          {errorMessage}
        </Typography>
      )}
      {success && (
        <Typography
          align="center"
          color="success"
          variant="bodyMediumExtraBold"
        >
          OTP verified successfully.
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
      <Box sx={{ textAlign: "center" }}>
        <Typography
          align="center"
          my={2}
          variant="bodyMediumExtraBold"
          color={"primary"}
          onClick={isResendDisabled ? undefined : sendAgain}
          sx={{
            cursor: isResendDisabled ? "not-allowed" : "pointer",
            display: "inline",
          }}
        >
          {isResendDisabled ? `Resend OTP in ${timer}s` : "Resend OTP"}
        </Typography>
      </Box>

      <Box display={"flex"} gap={2} pt={2} pb={3}>
        {!required && (
          <CommonButton
            fullWidth
            text="Back"
            variant="contained"
            color="secondary"
            onClick={() => setStep(step - 1)}
            disabled={loading}
            loading={loading}
          />
        )}
        <CommonButton
          type="submit"
          text="Proceed"
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleProceed}
          disabled={!otp.trim() || loading}
          loading={loading}
        />
      </Box>
    </Box>
  );
};

export default OtpReceiver;
