import React, { useState } from "react";
import { Box, TextField, Button, Chip, Typography } from "@mui/material";
import { useStepForm } from "../../../store/StepFormContext";
import { staticText } from "../../../utils/staticText";
import CommonTextField from "../../common/CommonTextField";
import CommonButton from "../../common/CommonButton";

const InviteCollaborators: React.FC = () => {
  const { userDetails, updateUserDetails, goToNextStep, goToPreviousStep } =
    useStepForm();
  const [email, setEmail] = useState("");

  const handleAddCollaborator = () => {
    if (email) {
      updateUserDetails({
        collaborators: [...userDetails.collaborators, email],
      });
      setEmail("");
    }
  };

  const handleRemoveCollaborator = (collaborator: string) => {
    updateUserDetails({
      collaborators: userDetails.collaborators.filter(
        (c) => c !== collaborator
      ),
    });
  };

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={"calc(100vh - 134px)"}
    >
      <Box sx={{ p: "40px", m: "auto" }} className="auth-form">
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
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <CommonTextField placeholder="Enter Email" type="email" />
        <Box sx={{ display: "flex", gap: 2,mt:4 }}>
          <CommonButton
            text={staticText.auth.inviteBUttonText}
            sx={{
              bgcolor: "secondary.main",
              "&:hover": {
                background: "#1A202C",
              },
            }}
            onClick={goToNextStep}
            fullWidth
          />
          <CommonButton
            text={staticText.auth.stepContinueText}
            onClick={goToNextStep}
            fullWidth
          />
        </Box>
        {/* <Button variant="contained" onClick={goToPreviousStep} sx={{ mr: 2 }}>
        Back
      </Button> */}

        {/* </form> */}
      </Box>
    </Box>
    // <Box>
    //   <h2>Invite Collaborators</h2>
    //   <TextField
    //     label="Email Address"
    //     value={email}
    //     onChange={(e) => setEmail(e.target.value)}
    //     fullWidth
    //   />
    //   <Button variant="contained" onClick={handleAddCollaborator} sx={{ mt: 2 }}>
    //     Add Collaborator
    //   </Button>
    //   <Box mt={2}>
    //     {userDetails.collaborators.map((collaborator, index) => (
    //       <Chip
    //         key={index}
    //         label={collaborator}
    //         onDelete={() => handleRemoveCollaborator(collaborator)}
    //         sx={{ mr: 1, mt: 1 }}
    //       />
    //     ))}
    //   </Box>
    //   <Box mt={2}>
    //     <Button variant="contained" onClick={goToPreviousStep} sx={{ mr: 2 }}>
    //       Back
    //     </Button>
    //     <Button variant="contained" onClick={goToNextStep}>
    //       Next
    //     </Button>
    //   </Box>
    // </Box>
  );
};

export default InviteCollaborators;
