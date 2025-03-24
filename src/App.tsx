import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./store/AuthContext";
import { StepFormProvider } from "./store/StepFormContext";
import { AvailabilityProvider } from "./store/AvailabilityContext";
import { AppointmentCheckerProvider } from "./store/AppointmentCheckerContext";

function App() {
  return (
    <AppointmentCheckerProvider>
      <AuthProvider>
        <AvailabilityProvider>
          <StepFormProvider>
            <AppRoutes />
          </StepFormProvider>
        </AvailabilityProvider>
      </AuthProvider>
    </AppointmentCheckerProvider>
  );
}

export default App;
