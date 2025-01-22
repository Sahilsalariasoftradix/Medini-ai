import { createTheme } from "@mui/material/styles";
import palette from "./palette";
import typography from './typography';
import components from './components';
const theme = createTheme({
  palette,   // Custom color palette
  typography, // Custom typography settings
  components,   // Custom component overrides
});

export default theme;
