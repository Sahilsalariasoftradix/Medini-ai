import { Components, Theme } from "@mui/material/styles";

const components: Components<Omit<Theme, "components">> = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: "12px", // Rounded corners
        textTransform: "none", // Disable uppercase transformation
        padding: "8px 16px", // Default padding
        fontWeight: 600, // Bold text
        boxShadow: "none",
      },
      sizeSmall: {
        padding: "6px 12px", // Smaller padding for small size
        fontSize: "0.875rem",
      },
      sizeLarge: {
        padding: "10px 20px", // Larger padding for large size
        fontSize: "1rem",
      },
      containedPrimary: {
        backgroundColor: "#358FF7", // Primary button color
        color: "#ffffff",
        "&:hover": {
          backgroundColor: "#1565C0", // Darker blue on hover
        },
      },
      containedSecondary: {
        backgroundColor: "#1A202C", // Secondary button color
        color: "#ffffff",
        "&:hover": {
          backgroundColor: "#424242", // Darker gray on hover
        },
      },
      outlinedPrimary: {
        borderColor: "#E2E8F0",
        color: "#1A202C",
        // "&:hover": {
        //   borderColor: "#1565C0",
        // },
      },
    },
    defaultProps: {
      disableRipple: true, // Disable ripple effect globally for buttons
    },
  },

  MuiTextField: {
    styleOverrides: {
      root: {
        "& .MuiInputBase-root": {
          borderRadius: "12px",
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#E2E8F0",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#1E88E5",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#1E88E5",
        },
        "& .MuiInputBase-input": {
          color: "#1A202C", // Text color for the input
          fontSize: "16px", // Font size for the input text
          fontWeight: "500", // Font weight for the input text
          "&::placeholder": {
            color: "#A0AEC0",
            opacity: 1,
            fontWeight: "400",
          },
        },
       
      },
      
      
    },

    defaultProps: {
      variant: "outlined",
    },
  },
  MuiFormHelperText: {
    styleOverrides: {
      root: {
        color: '#FF4747',
        }
      }
    },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: "12px",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: "#E2E8F0",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: "#1E88E5",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: "#1E88E5",
        },
        "& .MuiInputBase-input": {
          color: "#1A202C",
          fontSize: "16px",
          fontWeight: "500",
          "&::placeholder": {
            color: "#A0AEC0",
            opacity: 1,
            fontWeight: "400",
          },
        },
      },
    },
  },
  MuiCheckbox: {
    styleOverrides: {
      root: {
        "& .MuiCheckbox-icon": {
          borderRadius: 50,
        },
      },
    },
  },
  MuiFormControlLabel: {
    styleOverrides: {
      label: {
        fontSize: "16px", // Example: custom font size
        color: "#1A202C", // Example: custom color for the label
        fontWeight: "600", // Example: bold label text
        "&.Mui-checked": {
          color: "blue", // Example: change label color when checked
        },
      },
    },
  },

  MuiTypography: {
    // styleOverrides: {
    //   root: {
    //     color: "#1A202C", // Default text color
    //   },
    // },
    defaultProps: {
      variantMapping: {
        bodyXLargeExtraBold: "p",
        bodyXLargeSemiBold: "p",
        bodyXLargeMedium: "p",
        bodyXLargeRegular: "p",
        bodyLargeExtraBold: "p",
        bodyLargeSemiBold: "p",
        bodyLargeMedium: "p",
        bodyLargeRegular: "p",
        bodyMediumExtraBold: "p",
        bodyMediumSemiBold: "p",
        bodyMediumMedium: "p",
        bodyMediumRegular: "p",
        bodySmallExtraBold: "p",
        bodySmallSemiBold: "p",
        bodySmallMedium: "p",
        bodySmallRegular: "p",
        bodyXSmallExtraBold: "p",
        bodyXSmallSemiBold: "p",
        bodyXSmallMedium: "p",
        bodyXSmallRegular: "p",
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: {
        borderRadius: "12px", // Rounded corners for Paper
        padding: "16px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: {
        borderRadius: "16px", // Rounded corners for Chips
        fontWeight: 500,
        padding: "4px 12px",
      },
    },
  },
};

export default components;
