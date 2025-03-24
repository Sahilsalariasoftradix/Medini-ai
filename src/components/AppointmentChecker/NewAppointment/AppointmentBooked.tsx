import { Box, Typography, Paper, Grid, Divider, Stack } from "@mui/material";
import { useAppointmentChecker } from "../../../store/AppointmentCheckerContext";
import CommonButton from "../../common/CommonButton";
import { format } from 'date-fns';

const AppointmentBooked = () => {
  const { setStep, appointmentData } = useAppointmentChecker();

  // Format date and time for display
  //@ts-ignore
  const formattedDate = appointmentData?.date ? 
  //@ts-ignore
    format(new Date(appointmentData.date), 'MMMM dd, yyyy') : 'Not selected';
    //@ts-ignore
  const formattedTime = appointmentData?.time ? 
  //@ts-ignore
    format(new Date(appointmentData.time), 'h:mm a') : 'Not selected';

  return (
    <Box>
      <Box display="flex" justifyContent="center" my={2}>
        {/* <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60 }} /> */}
      </Box>
      
      <Typography
        align="center"
        variant="h3"
        mb={2}
        sx={{ fontSize: { xs: 24, md: 28 } }}
      >
        Appointment Booked Successfully
      </Typography>
      
      <Typography
        align="center"
        variant="bodyLargeMedium"
        sx={{ mb: 3 }}
        color="grey.600"
      >
        Your appointment has been successfully booked.
      </Typography>
      
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2}>
          <Typography variant="h6" gutterBottom>
            Appointment Confirmation
          </Typography>
          <Divider />
          
          <Grid container spacing={2}>
            <Grid item xs={5}>
              <Typography color="text.secondary">Appointment ID:</Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography fontWeight="500">APT-{Math.floor(Math.random() * 10000)}</Typography>
            </Grid>
            
            <Grid item xs={5}>
              <Typography color="text.secondary">Name:</Typography>
            </Grid>
            <Grid item xs={7}>
              {/* <Typography>{appointmentData?.name || 'N/A'}</Typography> */}
            </Grid>
            
            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
            
            <Grid item xs={5}>
              <Typography color="text.secondary">Date:</Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography fontWeight="500">{formattedDate}</Typography>
            </Grid>
            
            <Grid item xs={5}>
              <Typography color="text.secondary">Time:</Typography>
            </Grid>
            <Grid item xs={7}>
              <Typography fontWeight="500">{formattedTime}</Typography>
            </Grid>
            
            <Grid item xs={5}>
              <Typography color="text.secondary">Doctor:</Typography>
            </Grid>
            <Grid item xs={7}>
              {/* <Typography>{appointmentData?.doctor || 'N/A'}</Typography> */}
            </Grid>
            
            <Grid item xs={5}>
              <Typography color="text.secondary">Service:</Typography>
            </Grid>
            <Grid item xs={7}>
              {/* <Typography>{appointmentData?.serviceType || 'N/A'}</Typography> */}
            </Grid>
          </Grid>
        </Stack>
      </Paper>
      
      <Box sx={{ p: 2, bgcolor: 'info.light', borderRadius: 1, mb: 3 }}>
        <Typography variant="body2" color="info.contrastText">
          A confirmation email has been sent to your email address. Please arrive 15 minutes before your scheduled appointment time.
        </Typography>
      </Box>
      
      <Box my={4} display="flex" justifyContent="center">
        <CommonButton
          text="Return to Home"
          variant="contained"
          color="primary"
          onClick={() => {
            // Reset to first step or home page
            setStep(0);
          }}
        >
          Return to Home
        </CommonButton>
      </Box>
    </Box>
  );
};

export default AppointmentBooked;