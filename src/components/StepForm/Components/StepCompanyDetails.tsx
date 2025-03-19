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
import { APPOINTMENT_OPTIONS, COUNTRY_OPTIONS } from "../../../utils/options";
import { useAuthHook } from "../../../hooks/useAuth";
import { postCompanyDetails } from "../../../api/userApi";
import { EnOnboardingStatus } from "../../../utils/enums";

const CompanyDetails: React.FC = () => {
  const { updateUserDetails, skipNextStep, setCompanyId } = useStepForm();

  const { isLoading, setIsLoading } = useAuthHook();
  // Validate hook
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<CompanyDetailsSchemaType>({
    resolver: zodResolver(CompanyDetailsSchema),
    defaultValues: {
      in_person_appointments: false,
      city: "",
      country: "",
      max_appointment_time: "", // Default value prevents uncontrolled-to-controlled issue
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
      const companyData = {
        company_name: data.company_name,
        address_line_one: data.address_line_one,
        address_line_two: data.address_line_two!,
        city: data.city,
        country: data.country,
        in_person_appointments: data.in_person_appointments ?? false,
        max_appointment_time: Number(data.max_appointment_time),
      };
      const updatedDetails = { companyDetails: companyData };
      // Send company details
      const response = await postCompanyDetails(companyData);
      await updateUserDetailsInFirestore(userId, {
        onboardingStatus: EnOnboardingStatus.STATUS_1, // Use updatedStatus directly
      });

      setCompanyId(response.company?.id);
      updateUserDetails({
        ...updatedDetails,
        onboardingStatus: EnOnboardingStatus.STATUS_1,
      });
      // Step 3: Update context with new user details

      updateUserDetails(updatedDetails);
      skipNextStep();
    } catch (error) {
      setIsLoading(false);
      console.error(errorSavingUserDetailsMessage, error);
    }
  };

  return (
    <StepFormLayout>
      <Typography
        align="center"
        variant="h3"
        sx={{ fontSize: { xs: 24, md: 28 } }}
      >
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
        <Grid container spacing={1}>
          <Grid size={12}>
            <Typography mb={1} variant="bodyLargeExtraBold" color="grey.600">
              Business Name
            </Typography>

            <CommonTextField
              placeholder="Office Name"
              register={register("company_name")}
              errorMessage={errors.company_name?.message}
            />
          </Grid>
          <Grid size={6}>
          <Typography mb={1} variant="bodyLargeExtraBold" color="grey.600">
              Address
            </Typography>
            <CommonTextField
              placeholder="Line 1"
              register={register("address_line_one")}
              errorMessage={errors.address_line_one?.message}
            />
          </Grid>
          <Grid size={6}>
            
            <Typography
              mb={1}
              noWrap
              variant="bodyLargeExtraBold"
              color="grey.600"
            >
              Apartment, suite, or etc.
            </Typography>
            <CommonTextField
              placeholder="Line 2"
              register={register("address_line_two")}
              errorMessage={errors.address_line_two?.message}
            />
          </Grid>

          <Grid size={6}>
            <Typography mb={1} variant="bodyLargeExtraBold" color="grey.600">
              City
            </Typography>
            {/* City */}

            <CommonTextField
              placeholder="Enter City"
              register={register("city")}
              errorMessage={errors.city?.message}
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
            <Typography variant="bodyLargeMedium" noWrap color="grey.600">
              Do you take in person appointments?{" "}
            </Typography>
            {/* Appointment Switch */}
            <CustomSwitch
              name="in_person_appointments"
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
              name="max_appointment_time"
              control={control}
              errors={errors}
              placeholder="Select appointment"
              options={APPOINTMENT_OPTIONS}
            />
          </Grid>
        </Grid>
        <Box mt={2} justifyContent={"center"} display={"flex"}>
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
