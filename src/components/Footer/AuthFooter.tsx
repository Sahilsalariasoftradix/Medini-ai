import { Box } from "@mui/material";
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
      <CommonLink to={externalLinks.privacyPolicy} variant="bodyLargeSemiBold">
        {text.privacyPolicyLink}
      </CommonLink>
      <CommonLink to={"#"} variant="bodyLargeSemiBold">
        {text.copyright} {new Date().getFullYear()}
      </CommonLink>
    </Box>
  );
};

export default AuthFooter;
