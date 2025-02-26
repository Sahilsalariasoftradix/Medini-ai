import React, { useEffect, useState } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import { useStepForm } from "../../../store/StepFormContext";
import { Icons } from "../../../utils/Icons";
import { getReasons } from "../../../firebase/AuthService";
import { errorFetchingReasonsMessageText } from "../../../utils/errorHandler";
import { useAuthHook } from "../../../hooks/useAuth";
import CommonSnackbar from "../../common/CommonSnackbar";

const ReasonForUsing: React.FC = () => {
  const { userDetails, updateUserDetails, goToNextStep } = useStepForm();
  const {
    setSnackbarOpen,
    snackbarMessage,
    setSnackbarMessage,
    snackbarSeverity,
    handleSnackbarClose,
    setSnackbarSeverity,
    snackbarOpen,
  } = useAuthHook();
  const [reasons, setReasons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReasons = async () => {
      try {
        const reasonsList = await getReasons();
        // Map over reasons and assign an icon based on the name

        // Map over reasons and assign an icon based on the id
        const reasonsWithIcons = reasonsList?.map((reason: any) => {
          // Create the key for the icon based on the id
          const iconKey = `option${reason.id}` as
            | "option1"
            | "option2"
            | "option3"
            | "option4";

          // Fetch the corresponding icon
          const icon = Icons[iconKey];

          // Return the reason with the added icon
          return { ...reason, icon };
        });
        setReasons(reasonsWithIcons as any);
      } catch (error: any) {
        setSnackbarSeverity("error");
        setSnackbarMessage(error.message || errorFetchingReasonsMessageText);
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };
    fetchReasons();
  }, []);

  const handleReasonChange = (reasonId: string, reasonText: string) => {
    // Update the user details with the selected reason
    updateUserDetails({
      reasonForUsing: reasonId,
      reasonForUsingStep: reasonText,
    });
    // As soon as we select the value go to the next step
    goToNextStep();
  };

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      minHeight={"calc(100vh - 134px)"}
    >
      <Box mx={{ xs: 1, md: 0 }}>
        <Typography align="center" variant="h3">
          Tell us your main reason for <br /> using Medini?
        </Typography>
        <Typography
          mt={2}
          align="center"
          variant="bodyLargeMedium"
          sx={{ color: "grey.600" }}
        >
          Tell us about your practice and we will make the right <br />{" "}
          recommendations for you
        </Typography>{" "}
        <Box
          mt={8}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          gap={2}
          flexWrap={"wrap"}
        >
          {loading ? (
            <>
              {
                //@ts-ignore
                [...Array(4)].map((e, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    sx={{
                      borderRadius: "40px",
                      width: { xs: "180px", md: "200px" },
                      height: { xs: "180px", md: "200px" },
                    }}
                  />
                ))
              }
            </>
          ) : (
            <>
              {reasons.map((reason) => (
                <Box
                  key={reason.id}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  gap={2}
                  flexDirection={"column"}
                  sx={{
                    bgcolor:
                      userDetails.reasonForUsing === reason.id
                        ? "primary.main"
                        : "additional.white",
                    color:
                      userDetails.reasonForUsing === reason.id
                        ? "additional.white"
                        : "secondary.main",
                    borderRadius: "40px",
                    border: "1px solid #E2E8F0",
                    // p: 10,
                    height: { xs: "180px", md: "200px" },
                    width: { xs: "180px", md: "200px" },
                    "&:hover": {
                      background: "#358FF7",
                      color: "white",
                    },
                  }}
                  className={
                    userDetails.reasonForUsing === reason.id ? "active" : ""
                  }
                  onClick={() => handleReasonChange(reason.id, reason.name)}
                >
                  <Box
                    sx={{
                      height: "56px",
                      width: "56px",
                      background: "#FAFAFA",
                      borderRadius: "50% ",
                    }}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Box
                      component="img"
                      alt="The house from the offer."
                      src={reason.icon}
                    />
                  </Box>
                  <Typography align="center" px={2} variant="bodyLargeSemiBold">
                    {reason.name}
                  </Typography>
                </Box>
              ))}
            </>
          )}
        </Box>
        {/* Snackbar */}
        <CommonSnackbar
          open={snackbarOpen}
          onClose={handleSnackbarClose}
          message={snackbarMessage}
          severity={snackbarSeverity}
        />
      </Box>
    </Box>
  );
};

export default ReasonForUsing;
