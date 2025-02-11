import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./store/AuthContext";
import { StepFormProvider } from "./store/StepFormContext";
import { AvailabilityProvider } from './store/AvailabilityContext';

function App() {
  return (
    <AvailabilityProvider>
      <AuthProvider>
        <StepFormProvider>
          <AppRoutes />
        </StepFormProvider>
      </AuthProvider>
    </AvailabilityProvider>
  );
}

export default App;
