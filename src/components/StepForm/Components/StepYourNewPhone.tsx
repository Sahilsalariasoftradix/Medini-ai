import { useEffect } from "react";
import StepFormLayout from "../StepFormLayout";
import { Box, Skeleton, Typography } from "@mui/material";
import CommonButton from "../../common/CommonButton";
import { useStepForm } from "../../../store/StepFormContext";
import { getCompanyUniqueNumber } from "../../../api/userApi";
import { useAuth } from "../../../store/AuthContext";
import useLoading from "../../../hooks/useLoading";
import { formatPhoneNumber } from "../../../utils/common";
import {
  getCurrentUserId,
  // updateUserDetailsInFirestore,
} from "../../../firebase/AuthService";
import { userNotSignedInErrorMessage } from "../../../utils/errorHandler";

const YourNewPhone = () => {
  const { goToNextStep, setCompanyNumber, companyNumber, companyId } =
    useStepForm();
  const { loading, startLoading, stopLoading } = useLoading();
  const { userDetails } = useAuth();

  useEffect(() => {
    const fetchCompanyNumber = async () => {
      startLoading();
      try {
        // Step 1: Get the current user ID
        const userId = getCurrentUserId();
        if (!userId) {
          throw new Error(userNotSignedInErrorMessage);
        }
        const resp = await getCompanyUniqueNumber(companyId!);
        setCompanyNumber(formatPhoneNumber(resp.phoneNumber));
        // await updateUserDetailsInFirestore(userId, {
        //   company_phone: resp.phoneNumber,
        // });
      } catch (error) {
        console.error("Error fetching company number:", error);
      } finally {
        stopLoading();
      }
    };

    fetchCompanyNumber();
  }, [userDetails, setCompanyNumber, userDetails?.company_id]);

  return (
    <StepFormLayout>
      <Typography align="center" variant="h3">
        This is your new phone #
      </Typography>
      {loading ? (
        <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
          <Skeleton variant="text" sx={{ fontSize: "2rem" }} width={"50%"} />
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
        This is your new phone number for patient bookings. Share this with your
        patients to start receiving calls.
      </Typography>

      <form>
        <Box mt={0}>
          <Box justifyContent={"center"} display={"flex"} mt={2}></Box>
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
