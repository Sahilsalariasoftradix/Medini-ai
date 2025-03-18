import { Outlet } from "react-router-dom";
import { Box } from "@mui/material";
import mainLogo from "../assets/logos/medini-ai-logo.svg";
import CommonLink from "../components/common/CommonLink";

const NormalLayout = () => {
  return (
    <Box sx={{ bgcolor: "grey.200", height: "100vh" }}>
      <Box>
        <Box
          sx={{
            px: { xs: 1, md: 6 },
            py: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <CommonLink to={"/"}>
            <Box
              component="img"
              sx={{
                height: 39,
                width: 221,
                //   maxHeight: { xs: 39, md: 39 },
                //   maxWidth: { xs: 350, md: 250 },
              }}
              alt="logo"
              src={mainLogo}
            />
          </CommonLink>
        </Box>
      </Box>
      <Outlet />
    </Box>
  );
};

export default NormalLayout;
