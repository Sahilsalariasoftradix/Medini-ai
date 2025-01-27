import React from "react";
import { Box, TextField, Button } from "@mui/material";
import { useStepForm } from "../../../store/StepFormContext";
import Grid from "@mui/material/Grid2";

const CompanyDetails: React.FC = () => {
  const { userDetails, updateUserDetails, goToPreviousStep } = useStepForm();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    updateUserDetails({
      companyDetails: { ...userDetails.companyDetails, [name]: value },
    });
  };

  return (
    <Box>
      <h2>Company Details</h2>
      <Grid container spacing={2}>
        <Grid size={6}>
          <TextField
            label="Business Name"
            name="businessName"
            value={userDetails.companyDetails.businessName}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid size={6}>
          <TextField
            label="Address"
            name="address"
            value={userDetails.companyDetails.address}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid size={6}>
          <TextField
            label="Apartment/Suite"
            name="apartmentSuite"
            value={userDetails.companyDetails.apartmentSuite}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid size={6}>
          <TextField
            label="City"
            name="city"
            value={userDetails.companyDetails.city}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid size={6}>
          <TextField
            label="Country"
            name="country"
            value={userDetails.companyDetails.country}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
        <Grid size={6}>
          <TextField
            label="Max Appointment Time"
            name="maxAppointmentTime"
            value={userDetails.companyDetails.maxAppointmentTime}
            onChange={handleInputChange}
            fullWidth
          />
        </Grid>
      </Grid>
      <Box mt={2}>
        <Button variant="contained" onClick={goToPreviousStep} sx={{ mr: 2 }}>
          Back
        </Button>
        <Button variant="contained" onClick={() => alert("Form Submitted")}>
          Submit
        </Button>
      </Box>
    </Box>
  );
};
    
export default CompanyDetails;
