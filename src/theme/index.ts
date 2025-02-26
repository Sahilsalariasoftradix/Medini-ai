import { createTheme } from "@mui/material/styles";
import palette from "./palette";
import typography from './typography';
import components from './components';
const theme = createTheme({
  palette,   // Custom color palette
  typography, // Custom typography settings
  components,   // Custom component overrides
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1440,
      xl: 1536,
    },
  },
});

export default theme;
