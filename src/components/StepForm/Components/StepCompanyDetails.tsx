import React from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  FormControlLabel,
  Switch,
  SwitchProps,
  styled,
  SelectChangeEvent,
  FormHelperText,
} from "@mui/material";
import {
  CompanyDetailsSchema,
  CompanyDetailsSchemaType,
  useStepForm,
} from "../../../store/StepFormContext";
import Grid from "@mui/material/Grid2";
import StepFormLayout from "../StepFormLayout";
import CommonTextField from "../../common/CommonTextField";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CommonButton from "../../common/CommonButton";
import { IUserDetails } from "../../../types/api/Interfaces";
import { getCurrentUserId, saveUserDetailsToFirestore, updateUserDetailsInFirestore } from "../../../firebase/AuthService";
import { firebaseAuth } from "../../../firebase/BaseConfig";
const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 41,
  height: 24,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "primary.main",
        opacity: 1,
        border: 0,
        ...theme.applyStyles("dark", {
          backgroundColor: "#2ECA45",
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles("dark", {
        opacity: 0.3,
      }),
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 20,
    height: 20,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: "#39393D",
    }),
  },
}));

const CompanyDetails: React.FC = () => {
  const { userDetails, updateUserDetails, goToPreviousStep } = useStepForm();
  // Validate hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CompanyDetailsSchemaType>({
    resolver: zodResolver(CompanyDetailsSchema),
    defaultValues: {
      appointment: false,
      city: "",
      country: "",
      appointmentTime: "", // Default value prevents uncontrolled-to-controlled issue
    },
  });
  // const onSubmit = async (data: IUserDetails) => {
  //   try {
  //     // Save to context
  //     updateUserDetails(data);

  //     // Save to Firestore
  //     const userId = "user-uid"; // Replace with the logged-in user's UID from Firebase Auth
  //     await saveUserDetailsToFirestore(userId, data);

  //     console.log("User details saved successfully!");
  //   } catch (error) {
  //     console.error("Error saving user details:", error);
  //   }
  // };

  
  const onSubmit = async (data: CompanyDetailsSchemaType) => {
    try {
      // Step 1: Get the current user ID
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error("User is not signed in.");
      }
  
      // Step 2: Prepare updated details
      const updatedDetails = {
        companyDetails: {
          businessName: data.officeName,
          address: data.address,
          apartmentSuite: data.apartment,
          city: data.city,
          country: data.country,
          appointment: data.appointment ?? false,
          maxAppointmentTime: data.appointmentTime,
        },
      };
  
      // Step 3: Update context with new user details
      updateUserDetails(updatedDetails);
  
      // Step 4: Retrieve the latest user details from context
      const currentUserDetails = {
        ...userDetails, // Ensure existing details are preserved
        ...updatedDetails,
      };
  
      // Step 5: Save to Firestore
      await updateUserDetailsInFirestore(userId, currentUserDetails);
  
      console.log("User details saved successfully!");
    } catch (error) {
      console.error("Error saving user details to Firestore:", error);
    }
  };

  return (
    <StepFormLayout>
      <Typography align="center" variant="h3">
        Company Details
      </Typography>
      <Typography
        align="center"
        variant="bodyLargeRegular"
        sx={{ my: 1 }}
        color="grey.600"
      >
        What company name should users see when booking online?
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid size={12}>
            <Typography mb={1} variant="bodyLargeExtraBold" color="grey.600">
              Business Name
            </Typography>

            <CommonTextField
              placeholder="Office Name"
              register={register("officeName")}
              errorMessage={errors.officeName?.message}
            />
          </Grid>
          <Grid size={6}>
            <Typography mb={1} variant="bodyLargeExtraBold" color="grey.600">
              Apartment, suite, or etc.
            </Typography>
            <CommonTextField
              placeholder="Line 1"
              register={register("apartment")}
              errorMessage={errors.apartment?.message}
            />
          </Grid>
          <Grid size={6}>
            <Typography mb={1} variant="bodyLargeExtraBold" color="grey.600">
              Address
            </Typography>
            <CommonTextField
              placeholder="Line 2"
              register={register("address")}
              errorMessage={errors.address?.message}
            />
          </Grid>

          <Grid size={6}>
            <Typography mb={1} variant="bodyLargeExtraBold" color="grey.600">
              City
            </Typography>

            {/* City */}
            <Controller
              name="city"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.city}>
                  <Select {...field} displayEmpty>
                    <MenuItem value="">Select City</MenuItem>
                    <MenuItem value="city1">City 1</MenuItem>
                    <MenuItem value="city2">City 2</MenuItem>
                    <MenuItem value="city3">City 3</MenuItem>
                  </Select>
                  <FormHelperText>{errors.city?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid size={6}>
            <Typography mb={1} variant="bodyLargeExtraBold" color="grey.600">
              Country
            </Typography>
            {/* Country */}
            <Controller
              name="country"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.country}>
                  <Select {...field} displayEmpty>
                    <MenuItem value="">Select Country</MenuItem>
                    <MenuItem value="Country1">Country 1</MenuItem>
                    <MenuItem value="Country2">Country 2</MenuItem>
                    <MenuItem value="Country3">Country 3</MenuItem>
                  </Select>
                  <FormHelperText>{errors.country?.message}</FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
          <Grid
            my={1}
            size={12}
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="bodyLargeMedium" color="grey.600">
              Do you take in person appointments?{" "}
            </Typography>
            {/* <FormControlLabel
              label=""
              control={
                <IOSSwitch {...register("appointment")} defaultChecked />
              }
            /> */}
            {/* Appointment Switch */}
            <Controller
              name="appointment"
              control={control}
              render={({ field }) => (
                <Box>
                  <FormControlLabel
                    label=""
                    control={
                      <IOSSwitch
                        {...field}
                        checked={field.value} // Ensure it's controlled
                        onChange={(e) => field.onChange(e.target.checked)} // Update Hook Form state
                      />
                    }
                  />
                  {errors.appointment && (
                    <FormHelperText error>
                      {errors.appointment.message}
                    </FormHelperText>
                  )}
                </Box>
              )}
            />
          </Grid>
          <Grid size={6} my={2}>
            <Typography variant="bodyLargeMedium" color="grey.600">
              Max Appointment time
            </Typography>
          </Grid>
          <Grid size={6}>
            {/* Appointment Time */}
            <Controller
              name="appointmentTime"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.appointmentTime}>
                  <Select {...field} displayEmpty>
                    <MenuItem value="">Select appointment</MenuItem>
                    <MenuItem value="appointment1">appointment 1</MenuItem>
                    <MenuItem value="appointment2">appointment 2</MenuItem>
                    <MenuItem value="appointment3">appointment 3</MenuItem>
                  </Select>
                  <FormHelperText>
                    {errors.appointmentTime?.message}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
        <Box mt={4} justifyContent={"center"} display={"flex"}>
          <CommonButton
            sx={{ width: "70%", p: 1.5 }}
            // loading={isLoading}
            text={"Continue"}
            type="submit"
            fullWidth
          />
        </Box>
      </form>
    </StepFormLayout>
  );
};

export default CompanyDetails;
