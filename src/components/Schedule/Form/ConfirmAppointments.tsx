import { AlertProps, Box, FormHelperText, Typography } from "@mui/material";
import CustomSwitch from "../../common/CustomSwitch";
import CommonTextField from "../../common/CommonTextField";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import CommonButton from "../../common/CommonButton";
import { useAuth } from "../../../store/AuthContext";
import {
  getCurrentUserId,
  updateUserDetailsInFirestore,
} from "../../../firebase/AuthService";
import { userNotSignedInErrorMessage } from "../../../utils/errorHandler";
import { useEffect, useState } from "react";
import CommonSnackbar from "../../common/CommonSnackbar";

const confirmAppointmentsSchema = z.object({
  isConfirmed: z.boolean(),
  days: z
    .number({ invalid_type_error: "Days in advance is required" })
    .min(1, "Days in advance cannot be less than 1")
    .max(10, "Days in advance cannot be more than 10"),
});

type ConfirmAppointmentsFormData = z.infer<typeof confirmAppointmentsSchema>;

const ConfirmAppointments = () => {
  const { userDetails } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [disableInput, setDisableInput] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as AlertProps["severity"],
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<ConfirmAppointmentsFormData>({
    resolver: zodResolver(confirmAppointmentsSchema),
    defaultValues: {
      isConfirmed: userDetails?.confirmAppointments?.isConfirmed,
      days: userDetails?.confirmAppointments?.days,
    },
    mode: "onChange",
  });
  useEffect(() => {
    if (
      userDetails?.confirmAppointments?.isConfirmed === false ||
      userDetails?.confirmAppointments?.isConfirmed === undefined
    ) {
      setDisableInput(true);
    } else {
      setDisableInput(false);
    }
  }, [userDetails?.confirmAppointments?.isConfirmed]);

  const onSubmit = async (data: ConfirmAppointmentsFormData) => {
    setIsLoading(true);
    try {
      const userId = getCurrentUserId();
      if (!userId) {
        throw new Error(userNotSignedInErrorMessage);
      }
      // Step 2: Update Firestore with the new status
      await updateUserDetailsInFirestore(userId, {
        confirmAppointments: {
          isConfirmed: data.isConfirmed,
          days: data.days,
        },
      });
      if (!disableInput) {
        setSnackbar({
          open: true,
          message: `Texts/Calls will be sent ${data.days} days in advance`,
          severity: "success",
        });
      }
      setIsEditMode(false);
    } catch (error) {
      console.log(error);
      setSnackbar({
        open: true,
        message: "Appointments confirmation failed",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        mb={2}
      >
        <Typography
          variant="bodyLargeMedium"
          sx={{ fontWeight: "800", fontSize: "14px", lineHeight: "21px" }}
        >
          Confirm Appointments
        </Typography>
        <Controller
          name="isConfirmed"
          control={control}
          render={({ field: { onChange, value } }) => (
            <CustomSwitch
              name="isConfirmed"
              checked={value} // Ensure the switch reflects the current value
              onChange={(e) => {
                setIsEditMode(true);
                setDisableInput(!e.target.checked);

                onChange(e.target.checked); // Update react-hook-form state
              }}
            />
          )}
        />
      </Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            justifyContent: "space-between",
          }}
        >
          <Box display="flex" alignItems="center" gap={1}>
            <Box>
              <Controller
                name="days"
                control={control}
                defaultValue={2}
                render={({ field: { onChange, value } }) => (
                  <CommonTextField
                    type="number"
                    disabled={disableInput}
                    value={value}
                    //@ts-ignore
                    error={errors.days?.message}
                    sx={{
                      width: "60px",

                      input: {
                        "&[type=number]": {
                          "-moz-appearance": "textfield",
                          textAlign: "center",
                        },
                        "&::-webkit-outer-spin-button": {
                          "-webkit-appearance": "none",
                          margin: 0,
                        },
                        "&::-webkit-inner-spin-button": {
                          "-webkit-appearance": "none",
                          margin: 0,
                        },
                      },
                    }}
                    onChange={(e) => {
                      setIsEditMode(true);
                      const num = Number(e.target.value);
                      clearErrors("days");
                      if (num < 1) {
                        setError("days", {
                          type: "manual",
                          message: "Days in advance cannot be less than 1",
                        });
                      } else if (num > 10) {
                        setError("days", {
                          type: "manual",
                          message: "Days in advance cannot be more than 10",
                        });
                      }
                      onChange(Number(e.target.value));
                    }}
                  />
                )}
              />
            </Box>

            <Typography
              sx={{
                fontSize: "14px",
                fontWeight: "500",
                lineHeight: "21px",
                color: "#1A202C",
              }}
            >
              Days in advance
            </Typography>
          </Box>
          {isEditMode && (
            <CommonButton
              text="Save"
              variant="contained"
              color="primary"
              sx={{ width: "100px" }}
              type="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              Confirm
            </CommonButton>
          )}
        </Box>
        <FormHelperText sx={{ color: "red" }}>
          {errors?.days?.message}
        </FormHelperText>
        <CommonSnackbar
          onClose={() =>
            setSnackbar({ open: false, message: "", severity: "success" })
          }
          open={snackbar.open}
          message={snackbar.message}
          severity={snackbar.severity}
        />
      </form>
    </>
  );
};

export default ConfirmAppointments;
