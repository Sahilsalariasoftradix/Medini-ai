import { TypographyOptions } from "@mui/material/styles/createTypography";

const typography: TypographyOptions = {
  fontFamily: "'Manrope', sans-serif",
  h1: {
    fontSize: "3rem", // Equivalent to 48px
    fontWeight: 700,
    lineHeight: 1.5,
    letterSpacing: "-0.01562em",
  },
  h2: {
    fontSize: "2.5rem", // Equivalent to 40px
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: "-0.00833em",
  },
  h3: {
    fontSize: "2rem", // Equivalent to 32px
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: "0em",
  },
  h4: {
    fontSize: "1.5rem", // Equivalent to 24px
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: "0.00735em",
  },
  h5: {
    fontSize: "1.25rem", // Equivalent to 20px
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: "0em",
  },
  h6: {
    fontSize: "1.125rem", // Equivalent to 18px
    fontWeight: 500,
    lineHeight: 1.5,
    letterSpacing: "0.0075em",
  },
  body1: {
    fontSize: "1rem", // Equivalent to 16px
    fontWeight: 400,
    lineHeight: 1.5,
    letterSpacing: "0.00938em",
  },
  body2: {
    fontSize: "0.875rem", // Equivalent to 14px
    fontWeight: 400,
    lineHeight: 1.43,
    letterSpacing: "0.01071em",
  },
  subtitle1: {
    fontSize: "1rem", // Equivalent to 16px
    fontWeight: 500,
    lineHeight: 1.75,
    letterSpacing: "0.00938em",
  },
  subtitle2: {
    fontSize: "0.875rem", // Equivalent to 14px
    fontWeight: 500,
    lineHeight: 1.57,
    letterSpacing: "0.00714em",
  },
  caption: {
    fontSize: "0.75rem", // Equivalent to 12px
    fontWeight: 400,
    lineHeight: 1.66,
    letterSpacing: "0.03333em",
  },
  overline: {
    fontSize: "0.75rem", // Equivalent to 12px
    fontWeight: 400,
    lineHeight: 2.66,
    letterSpacing: "0.08333em",
    textTransform: "uppercase",
  },
  button: {
    fontSize: "0.875rem", // Equivalent to 14px
    fontWeight: 600,
    lineHeight: 1.75,
    letterSpacing: "0.02857em",
    textTransform: "uppercase",
  },
};

export default typography;
