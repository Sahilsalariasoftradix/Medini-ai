import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./store/AuthContext";
import { StepFormProvider } from "./store/StepFormContext";
import { AvailabilityProvider } from "./store/AvailabilityContext";

function App() {
  return (
    <AuthProvider>
      <AvailabilityProvider>
        <StepFormProvider>
          <AppRoutes />
        </StepFormProvider>
      </AvailabilityProvider>
    </AuthProvider>
  );
}

export default App;
