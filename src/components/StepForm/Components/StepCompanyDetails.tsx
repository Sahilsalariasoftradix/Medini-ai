import React from "react";
import { Box, Typography } from "@mui/material";
import {
  CompanyDetailsSchema,
  CompanyDetailsSchemaType,
  useStepForm,
} from "../../../store/StepFormContext";
import Grid from "@mui/material/Grid2";
import StepFormLayout from "../StepFormLayout";
import CommonTextField from "../../common/CommonTextField";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CommonButton from "../../common/CommonButton";
import {
  getCurrentUserId,
  updateUserDetailsInFirestore,
} from "../../../firebase/AuthService";
import CustomSwitch from "../../common/CustomSwitch";
import {
  errorSavingUserDetailsMessage,
  userNotSignedInErrorMessage,
} from "../../../utils/errorHandler";
import CustomSelect from "../../common/CustomSelect";
import {
  APPOINTMENT_OPTIONS,
  CITY_OPTIONS,
  COUNTRY_OPTIONS,
} from "../../../utils/options";
import { useAuthHook } from "../../../hooks/useAuth";
import { routes } from "../../../utils/links";

const CompanyDetails: React.FC = () => {
  const { userDetails, updateUserDetails, goToPreviousStep, resetForm,goToNextStep } =
    useStepForm();

  const { navigate, isLoading, setIsLoading } = useAuthHook();
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

  const onSubmit = async (data: CompanyDetailsSchemaType) => {
    setIsLoading(true);
    try {
      // Step 1: Get the current user ID
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error(userNotSignedInErrorMessage);
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
      goToNextStep();
      // Step 4: Retrieve the latest user details from context
      const currentUserDetails = {
        ...userDetails, // Ensure existing details are preserved
        ...updatedDetails,
      };

      // Step 5: Save to Firestore
      // await updateUserDetailsInFirestore(userId, currentUserDetails);
      // setIsLoading(false);
      // resetForm();
      // navigate(routes.dashboard.home);

      // console.log("User details saved successfully!");
    } catch (error) {
      setIsLoading(false);
      console.error(errorSavingUserDetailsMessage, error);
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
            <CustomSelect
              name="city"
              control={control}
              errors={errors}
              placeholder="Select city"
              options={CITY_OPTIONS}
            />
          </Grid>
          <Grid size={6}>
            <Typography mb={1} variant="bodyLargeExtraBold" color="grey.600">
              Country
            </Typography>
            {/* Country */}
            <CustomSelect
              name="country"
              control={control}
              errors={errors}
              placeholder="Select country"
              options={COUNTRY_OPTIONS}
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
            {/* Appointment Switch */}
            <CustomSwitch
              name="appointment"
              control={control}
              errors={errors}
            />
          </Grid>
          <Grid size={6} my={2}>
            <Typography variant="bodyLargeMedium" color="grey.600">
              Max Appointment time
            </Typography>
          </Grid>
          <Grid size={6}>
            {/* Appointment Time */}
            <CustomSelect
              name="appointmentTime"
              control={control}
              errors={errors}
              placeholder="Select appointment"
              options={APPOINTMENT_OPTIONS}
            />
          </Grid>
        </Grid>
        <Box mt={4} justifyContent={"center"} display={"flex"}>
          <CommonButton
            sx={{ width: "70%", p: 1.5 }}
            loading={isLoading}
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
