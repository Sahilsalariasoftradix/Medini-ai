import { Box, Typography } from "@mui/material";
import StepFormLayout from "../StepFormLayout";
import CommonButton from "../../common/CommonButton";
import { useStepForm } from "../../../store/StepFormContext";
import img from "../../../assets/images/auth/call-center.png";

const ProceedCallCenter = () => {
  const { goToNextStep } = useStepForm();
  return (
    <StepFormLayout>
      <Typography align="center" variant="h3" sx={{ fontSize: { xs: 24, md: 28 } }}>
        Call Center
      </Typography>
      <Typography
        align="center"
        variant="bodyLargeRegular"
        sx={{ my: 1 }}
        color="grey.600"
      >
        Add the people to contact for appointment bookings and cancellations in
        the Call Center
      </Typography>
     <Box display={'flex'} justifyContent={'center'} my={1}>
     <Box
        component="img"
        sx={{
          width: "95%",
          height: "95%",
        }}
        alt="The house from the offer."
        src={img}
      />
     </Box>
      <Box mt={0}>
        <CommonButton
          sx={{ p: 1.5, mt: 2 }}
          text={"Continue"}
          onClick={goToNextStep}
          fullWidth
        />
      </Box>
    </StepFormLayout>
  );
};

export default ProceedCallCenter;
