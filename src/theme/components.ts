import { Components, Theme } from "@mui/material/styles";

const components: Components<Omit<Theme, "components">> = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: "12px", // Rounded corners
        textTransform: "none", // Disable uppercase transformation
        padding: "8px 16px", // Default padding
        fontWeight: 800, // Bold text
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
        color: "#FF4747",
      },
    },
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
          borderColor: "#358FF7",
          borderWidth: "1px",
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
  MuiListItem: {
    styleOverrides: {
      root: {
        padding: "8px 20px", // Custom padding
        cursor: "pointer",
        borderRadius: "12px", // Rounded corners
        transition: "0.3s", // Smooth transition for hover effects
        color: "#718096", // Default text color
        "&:hover": {
          backgroundColor: "#358FF7", // Background color on hover
          color: "#fff", // Text color on hover
          fontWeight: "800", // Bold text on hover
          "& img": {
            filter:
              "brightness(0) saturate(100%) invert(100%) sepia(100%) saturate(0%) hue-rotate(198deg) brightness(104%) contrast(104%)",
            transition: "filter 0.3s", // Smooth transition for image color change
          },
        },
        "&.Mui-selected": {
          backgroundColor: "#358FF7", // Background color when selected
          color: "#fff", // Text color when selected
          "&:hover": {
            backgroundColor: "#1565c0", // Darker blue on hover when selected
          },
        },
      },
    },
  },

  MuiListItemText: {
    styleOverrides: {
      primary: {
        fontSize: "14px",
        fontWeight: 500,
      },
    },
  },
  MuiBadge: {
    styleOverrides: {
      badge: {
        backgroundColor: "#38BDF8", // ✅ Custom blue background
        color: "white", // ✅ Text color
        fontSize: "12px",
        fontWeight: "bold",
        padding: "4px 6px",
      },
    },
  },
  MuiChip: {
    styleOverrides: {
      root: ({ ownerState }: any) => ({
        fontWeight: 600,
        borderRadius: "8px",
        fontSize: "14px",
        height: "36px",
        width: "120px",
        padding: "4px 12px",
        cursor: ownerState.onClick ? "pointer" : "default",
        ...(ownerState.color === "success" && {
          backgroundColor: "#F6FDF9",
          color: "#22C55E",
        }),
        ...(ownerState.color === "error" && {
          backgroundColor: "#FFF5F5",
          color: "#FF4747",
        }),
        ...(ownerState.color === "warning" && {
          backgroundColor: "#FFFCF0",
          color: "#FACC15",
        }),
        ...(ownerState.color === "info" && {
          backgroundColor: "#EFF6FF",
          color: "#2563EB",
        }),
      }),
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
  // MuiChip: {
  //   styleOverrides: {
  //     root: {
  //       borderRadius: "16px", // Rounded corners for Chips
  //       fontWeight: 500,
  //       padding: "4px 12px",
  //     },
  //   },
  // },
};

export default components;
