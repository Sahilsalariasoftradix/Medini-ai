import { Box, Chip, Typography } from "@mui/material";
import { useStepForm } from "../../../store/StepFormContext";
import { staticText } from "../../../utils/staticText";
import CommonTextField from "../../common/CommonTextField";
import CommonButton from "../../common/CommonButton";
import {
  ResetPasswordSchema,
  ResetPasswordSchemaType,
  useAuthHook,
} from "../../../hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import CommonSnackbar from "../../common/CommonSnackbar";
import { collaboratorsErrorMessage } from "../../../utils/errorHandler";
import StepFormLayout from "../StepFormLayout";

const InviteCollaborators: React.FC = () => {
  const {
    setSnackbarOpen,
    snackbarMessage,
    setSnackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
    setSnackbarSeverity,
    snackbarOpen,
  } = useAuthHook();
  const { userDetails, updateUserDetails, goToNextStep } = useStepForm();
  // Validate hook
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(ResetPasswordSchema),
  });
  // useEffect(() => {
  //   goToNextStep();
  // }, []);

  const onSubmit: SubmitHandler<ResetPasswordSchemaType> = async (data) => {
    if (data.email) {
      // Check if the email already exists in the collaborators list
      const isDuplicate = userDetails.collaborators.includes(data.email);
      if (!isDuplicate) {
        // Add the email to the collaborators list if it's not a duplicate
        updateUserDetails({
          collaborators: [...userDetails.collaborators, data.email],
        });
        reset();
      } else {
        // Snackbar on error
        setSnackbarMessage(collaboratorsErrorMessage);
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    }
  };

  const handleRemoveCollaborator = (collaborator: string) => {
    updateUserDetails({
      collaborators: userDetails.collaborators.filter(
        (c) => c !== collaborator
      ),
    });
  };

  const goToTheNextStep = () => {
    if (userDetails.collaborators.length > 0) {
      goToNextStep();
    }
  };

  return (
    <StepFormLayout>
      <Typography variant="h3" align="center" mb={2}>
        {staticText.auth.inviteCollaboratorText}
      </Typography>
      <Typography
        variant="bodyLargeMedium"
        mb={4}
        color="grey.600"
        align="center"
      >
        {" "}
        {staticText.auth.inviteCollaboratorDescription}
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CommonTextField
          placeholder="Enter Email"
          register={register("email")}
          errorMessage={errors.email?.message}
          type="email"
        />
        <Box sx={{ display: "flex", gap: 2, mt: 4 }}>
          <CommonButton
            text={staticText.auth.inviteBUttonText}
            sx={{
              bgcolor: "secondary.main",
              "&:hover": {
                background: "#1A202C",
              },
            }}
            type="submit"
            fullWidth
          />
          <CommonButton
            text={staticText.auth.stepContinueText}
            type="submit"
            onClick={goToTheNextStep}
            fullWidth
          />
        </Box>
        {/* <Button variant="contained" onClick={goToPreviousStep} sx={{ mr: 2 }}>
        Back
      </Button> */}
      </form>
      {userDetails &&
        userDetails.collaborators.map((collaborator, index) => (
          <Chip
            key={index}
            label={collaborator}
            onDelete={() => handleRemoveCollaborator(collaborator)}
            sx={{ mr: 1, mt: 3 }}
          />
        ))}
      <CommonSnackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </StepFormLayout>
  );
};

export default InviteCollaborators;
