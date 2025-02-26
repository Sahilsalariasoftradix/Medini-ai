import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.scss"; //Global CSS file path
import App from "./App.tsx"; //Base App Component
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme/index.ts"; //Theme provider
// import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <App />
    </ThemeProvider>
  </StrictMode>
);
