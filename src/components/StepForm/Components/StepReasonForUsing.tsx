import React from "react";
import {
  Box,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
} from "@mui/material";
import { useStepForm } from "../../../store/StepFormContext";

const ReasonForUsing: React.FC = () => {
  const { userDetails, updateUserDetails, goToNextStep } = useStepForm();

  const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateUserDetails({ reasonForUsing: event.target.value });
  };

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={"calc(100vh - 134px)"}
    >
      <Box>
        <Typography variant="h3">
          Tell us your main reason for using Medini?
        </Typography>
        <Typography variant="bodyLargeMedium" sx={{ color: "grey.600" }}>
          Tell us about your practice and we will make the right recommendations
          for you
        </Typography>{" "}

        <Box
          sx={{
            bgcolor: "additional.white",
            borderRadius: "20px",
            p: 5,
            boxShadow: "border: 1px solid #E2E8F0",
            "&:hover": {
              background: "#358FF7",
              color: "white",
              
            },
          }}
        >
          <RadioGroup
            value={userDetails.reasonForUsing}
            onChange={handleReasonChange}
          >
            <FormControlLabel
              value="option1"
              control={<Radio />}
              label="Option 1"
            />
          </RadioGroup>
        </Box>
        <Button variant="contained" onClick={goToNextStep}>
          Next
        </Button>
      </Box>
    </Box>
  );
};

export default ReasonForUsing;
