import { Box, Typography } from "@mui/material";
import { staticText } from "../../utils/staticText";
import CommonLink from "../common/CommonLink";
import { externalLinks } from "../../utils/links";

const AuthFooter = () => {
  const text = staticText.auth;
  return (
    <Box
      px={4}
      display={"flex"}
      justifyContent={"space-between"}
      alignItems={"center"}
    >
      <CommonLink to={externalLinks.privacyPolicy} variant="bodyMediumSemiBold">
        {text.privacyPolicyLink}
      </CommonLink>
      <Typography variant="bodyMediumSemiBold" sx={{ color: "#358FF7" }}>
        {text.copyright} {new Date().getFullYear()}
      </Typography>
    </Box>
  );
};

export default AuthFooter;
