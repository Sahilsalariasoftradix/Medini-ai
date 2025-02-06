import { Box, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import AuthHeader from "../components/Header/AuthHeader";
import Grid from "@mui/material/Grid2";
import background1 from "../assets/images/auth-bg/bg-2.svg";
import background2 from "../assets/images/auth-bg/bg-1.svg";
import background3 from "../assets/images/auth-bg/bg-4.svg";
import background4 from "../assets/images/auth-bg/bg-3.svg";
import background5 from "../assets/images/auth-bg/bg-5.svg";
import { staticText } from "../utils/staticText";
import AuthFooter from "../components/Footer/AuthFooter";
const AnonymousLayout = () => {
  const text = staticText.auth;
  return (
    <Box sx={{ bgcolor: "grey.200", height: "100vh" }}>
      <Grid container spacing={2} sx={{ height: "100vh" }}>
        <Grid size={{ xs: 12, lg: 6 }} mx={{ xs: 3, lg: 0 }}>
          <AuthHeader />
          <Outlet context={[text]} />
          <AuthFooter />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }} p={3} display={{ xs: "none", lg: "block" }}>
          <Box
            sx={{
              backgroundColor: "primary.main",
              position: "relative",
              height: "100%",
              width: "100%",
            }}
          >
            <Box
              component="img"
              sx={{
                position: "absolute",
                top: "0px;",
                right: "3px",
              }}
              alt="The house from the offer."
              src={background1}
            />
            <Box
              component="img"
              sx={{
                position: "absolute",
                top: "100px",
                left: "100px",
              }}
              alt="The house from the offer."
              src={background2}
            />
            <Box
              component="img"
              sx={{
                position: "absolute",
                top: "500px",
                right: "100px",
              }}
              alt="The house from the offer."
              src={background3}
            />
            <Box
              component="img"
              sx={{
                position: "absolute",
                bottom: "0",
                left: "0",
              }}
              alt="The house from the offer."
              src={background4}
            />
            <Box
              component="img"
              sx={{
                position: "absolute",
                bottom: "10px",
                right: "120px",
              }}
              alt="The house from the offer."
              src={background5}
            />
            <Box
              sx={{
                position: "absolute",
                top: "70%",
                left: "40%",
                transform: "translate(-30%, -30%)",
              }}
            >
              <Typography
                sx={{
                  color: "additional.white",
                  fontWeight: "700",
                  fontSize: "40px",
                }}
                align="center"
              >
                {text.rightPanelHeading}
              </Typography>
              <Typography
                sx={{
                  color: "additional.white",
                  fontWeight: "500",
                  fontSize: "14px",
                }}
                my={2}
                align="center"
              >
                {text.rightPanelText}
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AnonymousLayout;
