import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./store/AuthContext";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
