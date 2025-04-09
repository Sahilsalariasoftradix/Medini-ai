import { Box, Typography, MenuItem } from "@mui/material";
import CommonTextField from "../../common/CommonTextField";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ExistingAppointmentSchema,
  ExistingAppointmentSchemaType,
} from "../../../store/StepFormContext";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CommonButton from "../../common/CommonButton";
import { useAppointmentChecker } from "../../../store/AppointmentCheckerContext";

import { MuiPhone } from "../../Auth/SignUp/CustomPhoneInput";
import { useCallback, useEffect, useState } from "react";
import CommonSnackbar from "../../common/CommonSnackbar";
import {
  getCustomerBookings,
  sendVerificationCode,
} from "../../../api/userApi";

const ExistingAppointment = () => {
  const {
    setStep,
    setExistingAppointmentData,
    step,
    existingAppointmentData,
    existingPhone,
    setExistingPhone,
    setSnackbar,
    snackbar,
    companyDetails,
    startTimer,
    loadMoreCompanies,
    hasMoreCompanies,
    isLoadingMoreCompanies,
    setUserBookings,
    // userBookings,
  } = useAppointmentChecker();
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
  } = useForm<ExistingAppointmentSchemaType>({
    resolver: zodResolver(ExistingAppointmentSchema),
    defaultValues: existingAppointmentData || {},
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (watch("appointment_location")?.id) {
      getCustomerBookings(Number(watch("appointment_location")?.id), existingPhone).then((bookings) => {
        setUserBookings(bookings);
      });
    }
  }, [watch("appointment_location")]);


  const onSubmit: SubmitHandler<ExistingAppointmentSchemaType> = async (
    data
  ) => {
    setLoading(true);
    if (!existingPhone || existingPhone.length < 12) {
      setSnackbar({
        open: true,
        message: "Please enter a valid phone number",
        severity: "error",
      });
      return;
    }
    setFormSubmitted(true);

    setExistingAppointmentData({
      ...data,
      appointment_location: {
        id: data.appointment_location.id,
        name:
          companyDetails.find(
            (company) =>
              company.company_id.toString() === data.appointment_location.id
          )?.company_name || "",
      },
      phone: existingPhone,
    });
    try {
      await sendVerificationCode(existingPhone, data.email);
      setStep(step + 1);
      startTimer();
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.message as string,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  // Function to handle scroll in business name dropdown
  const handleBusinessNameScroll = useCallback(
    (event: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;

      // Make the threshold more generous - load when within 50px of bottom
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;

      if (isNearBottom && hasMoreCompanies && !isLoadingMoreCompanies) {
        loadMoreCompanies();
      }
    },
    [hasMoreCompanies, isLoadingMoreCompanies, loadMoreCompanies]
  );
  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography
          align="center"
          variant="h3"
          my={2}
          sx={{ fontSize: { xs: 24, md: 28 } }}
        >
          Existing Appointment
        </Typography>
        <Typography
          align="center"
          variant="bodyLargeMedium"
          sx={{ mb: 5 }}
          color="grey.600"
        >
          Let's quickly find your appointment. Please verify your personal info
          to help us find it!
        </Typography>

        <Box>
          <Typography variant="bodyMediumExtraBold" color="grey.600">
            Phone
          </Typography>
          <MuiPhone
            value={existingPhone}
            onChange={(phone) => setExistingPhone(phone)}
            error={
              formSubmitted && (!existingPhone || existingPhone.length < 12)
            }
          />
        </Box>
        <Box mt={2}>
          <Typography mb={1} variant="bodyMediumExtraBold" color="grey.600">
            Email
          </Typography>
          <CommonTextField
            placeholder="Email"
            type="email"
            register={register("email")}
            error={!!errors?.email}
            helperText={errors?.email?.message}
          />
        </Box>
        <Box>
          <Box my={2}>
            <Typography mt={1} color="grey.600" variant="bodyMediumExtraBold">
              Where is your appointment?
            </Typography>
            <Controller
              name="appointment_location"
              control={control}
              render={({ field: { onChange, value, ...restField } }) => (
                <CommonTextField
                  {...restField}
                  value={value?.id || ""}
                  select
                  fullWidth
                  error={!!errors.appointment_location}
                  helperText={errors.appointment_location?.message}
                  onChange={(e) => {
                    const selectedId = e.target.value;
                    onChange({
                      id: selectedId,
                      name:
                        companyDetails.find(
                          (company) =>
                            company.company_id.toString() === selectedId
                        )?.company_name || "",
                    });
                  }}
                  SelectProps={{
                    displayEmpty: true,
                    MenuProps: {
                      PaperProps: {
                        style: {
                          maxHeight: 300,
                          overflow: "auto",
                        },
                        onScroll: handleBusinessNameScroll,
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>Search for your appointment</em>
                  </MenuItem>
                  {(companyDetails || []).map((company) => (
                    <MenuItem
                      key={company.company_id}
                      value={company.company_id.toString()}
                    >
                      {company.company_name}
                    </MenuItem>
                  ))}
                  {isLoadingMoreCompanies && (
                    <MenuItem disabled>
                      <Box
                        display="flex"
                        justifyContent="center"
                        width="100%"
                        py={1}
                      >
                        Loading more...
                      </Box>
                    </MenuItem>
                  )}
                  {!isLoadingMoreCompanies && hasMoreCompanies && (
                    <MenuItem
                      onClick={() => loadMoreCompanies()}
                      sx={{ justifyContent: "center", color: "primary.main" }}
                    >
                      Load more companies...
                    </MenuItem>
                  )}
                </CommonTextField>
              )}
            />
            {/* <FormHelperText>
              {errors.appointment_location?.message}
            </FormHelperText> */}
          </Box>
        </Box>
        <Box display={"flex"} gap={2} pt={5} pb={3}>
          <CommonButton
            fullWidth
            text="Back"
            variant="contained"
            color="secondary"
            onClick={() => setStep(step - 1)}
          />
          <CommonButton
            type="submit"
            text="Retrieve"
            fullWidth
            variant="contained"
            disabled={loading}
            color="primary"
            loading={loading}
          />
        </Box>
      </form>
      <CommonSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() =>
          setSnackbar({ open: false, message: "", severity: "success" })
        }
      />
    </Box>
  );
};

export default ExistingAppointment;
