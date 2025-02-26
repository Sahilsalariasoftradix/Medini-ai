import  { useEffect } from "react";
import StepFormLayout from "../StepFormLayout";
import { Box, Skeleton, Typography } from "@mui/material";
import CommonButton from "../../common/CommonButton";
import { useStepForm } from "../../../store/StepFormContext";
import { getCompanyUniqueNumber } from "../../../api/userApi";
import { useAuth } from "../../../store/AuthContext";
import useLoading from "../../../hooks/useLoading";

const YourNewPhone = () => {
  const { goToNextStep, setCompanyNumber, companyNumber } = useStepForm();
  const { loading, startLoading, stopLoading } = useLoading();
  const { userDetails } = useAuth();

  useEffect(() => {
    const fetchCompanyNumber = async () => {
      startLoading();
      try {
        const resp = await getCompanyUniqueNumber(userDetails.uuid);
        setCompanyNumber(resp.phoneNumber);
      } catch (error) {
        console.error("Error fetching company number:", error);
      } finally {
        stopLoading();
      }
    };

    fetchCompanyNumber();
  }, [userDetails.company_id]);

  return (
    <StepFormLayout>
      <Typography align="center" variant="h3">
        Your new phone #
      </Typography>
      <Typography
        align="center"
        variant="bodyLargeRegular"
        sx={{ my: 1 }}
        color="grey.600"
      >
        This is your new phone number for patient bookings.
      </Typography>
      {loading ? (
        <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
          <Skeleton variant="text" sx={{ fontSize: "2rem" }} width={'50%'} />
        </Box>
      ) : (
        <Typography align="center" variant="h3">
          {companyNumber}
        </Typography>
      )}
      <Typography
        align="center"
        variant="bodyLargeRegular"
        sx={{ my: 1 }}
        color="grey.600"
      >
        Share this with your patients to start receiving calls.
      </Typography>

      <form>
        <Box mt={0}>
          <Box justifyContent={"center"} display={"flex"} mt={4}></Box>
          <CommonButton
            sx={{ p: 1.5, mt: 2 }}
            text={"Continue"}
            onClick={goToNextStep}
            fullWidth
          />
        </Box>
      </form>
    </StepFormLayout>
  );
};

export default YourNewPhone;
