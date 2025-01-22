const palette = {
  primary: {
    main: "#358FF7", // Main blue color (default)
    light1: "#44AEFF", // Slightly lighter shade
    light2: "#8ECEFF", // Lighter than light1
    light3: "#BFE2FD", // Lighter than light2
    light4: "#E8F5FF", // Lightest shade
    // dark: "#E8F5FF", // Darker than main
    contrastText: "#FFFFFF", // Text color for contrast
  },
  secondary: {
    main: "#1A202C", // Main black color (default)
    light1: "#5D6A83", // Slightly lighter shade
    light2: "#96A3BE", // Lighter than light1
    light3: "#D8E3F8", // Lighter than light2
    light4: "#F2F6FF", // Lightest shade
    // dark: "#000000", // Darker than main (pure black)
    contrastText: "#FFFFFF", // Text color for contrast
  },
  success: {
    light: "#4ADE80", // Lighter green
    main: "#22C55E", // Default success green
    dark: "#16A34A", // Dark green
    contrastText: "#FFFFFF", // Text color for contrast
  },
  warning: {
    light: "#FDE047", // Lighter yellow
    main: "#FACC15", // Default warning yellow
    dark: "#EAB308", // Dark yellow
    contrastText: "#000000", // Text color for contrast
  },
  error: {
    light: "#FF7171", // Lighter red
    main: "#FF4747", // Default error red
    dark: "#DD3333", // Dark red
    contrastText: "#FFFFFF", // Text color for contrast
  },
  grey: {
    50: "#FAFAFA",
    100: "#F7FAFC",
    200: "#EDF2F7",
    300: "#E2E8F0",
    400: "#CBD5E0",
    500: "#A0AEC0",
    600: "#718096",
    700: "#2A313C",
    800: "#232B38",
    900: "#1A202C",
  },
  additional: {
    white: "#FFFFFF",
    orange: "#FF784B",
    amber: "#FFC837",
    purple: "#936DFF",
    sky: "#38BDF8",
  },
};

export default palette;
