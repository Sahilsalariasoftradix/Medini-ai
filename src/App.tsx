import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./store/AuthContext";
import { StepFormProvider } from "./store/StepFormContext";

function App() {
  return (
    <AuthProvider>
      <StepFormProvider>
        <AppRoutes />
      </StepFormProvider>
    </AuthProvider>
  );
}

export default App;
