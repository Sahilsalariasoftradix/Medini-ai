import { TypographyOptions } from "@mui/material/styles/createTypography";
// Extend TypographyVariants and TypographyVariantsOptions
declare module "@mui/material/styles" {
  interface TypographyVariants {
    bodyXLargeExtraBold: React.CSSProperties;
    bodyXLargeSemiBold: React.CSSProperties;
    bodyXLargeMedium: React.CSSProperties;
    bodyXLargeRegular: React.CSSProperties;
    bodyLargeExtraBold: React.CSSProperties;
    bodyLargeSemiBold: React.CSSProperties;
    bodyLargeMedium: React.CSSProperties;
    bodyLargeRegular: React.CSSProperties;
    bodyMediumExtraBold: React.CSSProperties;
    bodyMediumSemiBold: React.CSSProperties;
    bodyMediumMedium: React.CSSProperties;
    bodyMediumRegular: React.CSSProperties;
    bodySmallExtraBold: React.CSSProperties;
    bodySmallSemiBold: React.CSSProperties;
    bodySmallMedium: React.CSSProperties;
    bodySmallRegular: React.CSSProperties;
    bodyXSmallExtraBold: React.CSSProperties;
    bodyXSmallSemiBold: React.CSSProperties;
    bodyXSmallMedium: React.CSSProperties;
    bodyXSmallRegular: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    bodyXLargeExtraBold?: React.CSSProperties;
    bodyXLargeSemiBold?: React.CSSProperties;
    bodyXLargeMedium?: React.CSSProperties;
    bodyXLargeRegular?: React.CSSProperties;
    bodyLargeExtraBold?: React.CSSProperties;
    bodyLargeSemiBold?: React.CSSProperties;
    bodyLargeMedium?: React.CSSProperties;
    bodyLargeRegular?: React.CSSProperties;
    bodyMediumExtraBold?: React.CSSProperties;
    bodyMediumSemiBold?: React.CSSProperties;
    bodyMediumMedium?: React.CSSProperties;
    bodyMediumRegular?: React.CSSProperties;
    bodySmallExtraBold?: React.CSSProperties;
    bodySmallSemiBold?: React.CSSProperties;
    bodySmallMedium?: React.CSSProperties;
    bodySmallRegular?: React.CSSProperties;
    bodyXSmallExtraBold?: React.CSSProperties;
    bodyXSmallSemiBold?: React.CSSProperties;
    bodyXSmallMedium?: React.CSSProperties;
    bodyXSmallRegular?: React.CSSProperties;
  }
}

// Update Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    bodyXLargeExtraBold: true;
    bodyXLargeSemiBold: true;
    bodyXLargeMedium: true;
    bodyXLargeRegular: true;
    bodyLargeExtraBold: true;
    bodyLargeSemiBold: true;
    bodyLargeMedium: true;
    bodyLargeRegular: true;
    bodyMediumExtraBold: true;
    bodyMediumSemiBold: true;
    bodyMediumMedium: true;
    bodyMediumRegular: true;
    bodySmallExtraBold: true;
    bodySmallSemiBold: true;
    bodySmallMedium: true;
    bodySmallRegular: true;
    bodyXSmallExtraBold: true;
    bodyXSmallSemiBold: true;
    bodyXSmallMedium: true;
    bodyXSmallRegular: true;
  }
}

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
    fontWeight: 800,
    lineHeight: 1.5,
    letterSpacing: "0em",
  },
  h4: {
    fontSize: "1.5rem", // Equivalent to 24px
    fontWeight: 800,
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
    fontWeight: 800,
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
  bodyXLargeExtraBold: {
    fontSize: "18px",
    fontWeight: 800,
  },
  bodyXLargeSemiBold: {
    fontSize: "18px",
    fontWeight: 600,
  },
  bodyXLargeMedium: {
    fontSize: "18px",
    fontWeight: 500,
  },
  bodyXLargeRegular: {
    fontSize: "18px",
    fontWeight: 400,
  },
  bodyLargeExtraBold: {
    fontSize: "16px",
    fontWeight: 800,
  },
  bodyLargeSemiBold: {
    fontSize: "16px",
    fontWeight: 600,
  },
  bodyLargeMedium: {
    fontSize: "16px",
    fontWeight: 500,
  },
  bodyLargeRegular: {
    fontSize: "16px",
    fontWeight: 400,
  },
  bodyMediumExtraBold: {
    fontSize: "14px",
    fontWeight: 800,
  },
  bodyMediumSemiBold: {
    fontSize: "14px",
    fontWeight: 600,
  },
  bodyMediumMedium: {
    fontSize: "14px",
    fontWeight: 500,
  },
  bodyMediumRegular: {
    fontSize: "14px",
    fontWeight: 400,
  },
  bodySmallExtraBold: {
    fontSize: "12px",
    fontWeight: 800,
  },
  bodySmallSemiBold: {
    fontSize: "12px",
    fontWeight: 600,
  },
  bodySmallMedium: {
    fontSize: "12px",
    fontWeight: 500,
  },
  bodySmallRegular: {
    fontSize: "12px",
    fontWeight: 400,
  },
  bodyXSmallExtraBold: {
    fontSize: "10px",
    fontWeight: 800,
  },
  bodyXSmallSemiBold: {
    fontSize: "10px",
    fontWeight: 600,
  },
  bodyXSmallMedium: {
    fontSize: "10px",
    fontWeight: 500,
  },
  bodyXSmallRegular: {
    fontSize: "10px",
    fontWeight: 400,
  },
};

export default typography;
