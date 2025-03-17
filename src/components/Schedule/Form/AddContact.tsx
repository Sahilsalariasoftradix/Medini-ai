import { Typography } from "@mui/material";
import React from "react";
import CommonDialog from "../../common/CommonDialog";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createNewContact } from "../../../firebase/AppointmentService";
import CommonTextField from "../../common/CommonTextField";
import { z } from "zod";
import { formErrorMessage } from "../../../utils/errorHandler";
import { useAuthHook } from "../../../hooks/useAuth";
import CommonSnackbar from "../../common/CommonSnackbar";
import { useAuth } from "../../../store/AuthContext";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits long")
    .regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits")
    .nonempty("Phone number is required"),
  email: z
    .string()
    .min(1, { message: formErrorMessage.email.required }) // Checks if the field is empty
    .email({ message: formErrorMessage.email.invalid }),
});

export type ContactData = z.infer<typeof contactSchema>;

const AddContact = ({
  openDialog,
  setOpenDialog,
  fetchContacts, // Add this as a prop to call fetchContacts
}: {
  openDialog: boolean;
  setOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
  fetchContacts: () => void; // This will be the fetchContacts function passed from parent
}) => {
  const {
    setSnackbarOpen,
    snackbarMessage,
    setSnackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
    setSnackbarSeverity,
    snackbarOpen,
    setIsLoading,
  } = useAuthHook();
  const {
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting, errors: contactErrors },
  } = useForm<ContactData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
    },
  });
  const {userDetails} = useAuth();

  const onSubmit: SubmitHandler<ContactData> = async (data) => {
    setIsLoading(true);
    try {
      await createNewContact({...data,user_id:userDetails?.user_id});
      setSnackbarOpen(true);
      setSnackbarSeverity("success");
      setSnackbarMessage("Contact created successfully!");
      setOpenDialog(false);
      reset();
      setIsLoading(false);
      fetchContacts();
    } catch (error: any) {
      setSnackbarMessage(error);
      setSnackbarOpen(true);
      console.error("Error submitting form:", error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <CommonDialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          reset();
        }}
        confirmButtonType="primary"
        title="New Contact"
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        <Typography variant="bodyMediumExtraBold" color="grey.600">
          First Name
        </Typography>
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <CommonTextField
              helperText={contactErrors.firstName?.message}
              error={!!contactErrors.firstName}
              {...field}
              fullWidth
            />
          )}
        />

        <Typography variant="bodyMediumExtraBold" color="grey.600">
          Last Name
        </Typography>
        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <CommonTextField
              helperText={contactErrors.lastName?.message}
              error={!!contactErrors.lastName}
              {...field}
              fullWidth
            />
          )}
        />

        <Typography variant="bodyMediumExtraBold" color="grey.600">
          Email
        </Typography>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <CommonTextField
              error={!!contactErrors.email}
              helperText={contactErrors.email?.message}
              {...field}
              fullWidth
            />
          )}
        />

        <Typography variant="bodyMediumExtraBold" color="grey.600">
          Phone
        </Typography>
        <Controller
          name="phone"
          control={control}
          render={({ field }) => (
            <CommonTextField
              error={!!contactErrors.phone}
              helperText={contactErrors.phone?.message}
              {...field}
              fullWidth
            />
          )}
        />
      </CommonDialog>
      {/* Snackbar */}
      <CommonSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </>
  );
};

export default AddContact;
