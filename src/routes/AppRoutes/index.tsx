import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnonymousLayout from "../../layouts/AnonymousLayout";
import Login from "../../pages/Auth/Login";
import MainLayout from "../../layouts/MainLayout";
// import Home from "../../pages/Home";
import AuthFlow from "../../layouts/AuthFlowLayout";
import VerifyEmail from "../../pages/verification/verify-email";
import SignUp from "../../pages/Auth/sign-up";
import ResetPassword from "../../pages/Auth/reset-password";
import { routes } from "../../utils/links";
import NotFoundPage from "../../pages/NotFound";
import StepForm from "../../components/StepForm/StepForm";
import { useAuth } from "../../store/AuthContext";
import GuestRoute from "../GuestRoute";
import ProtectedRoute from "../ProtectedRoute";
import { Box, CircularProgress } from "@mui/material";
import Schedule from "../../pages/schedule";
import CallCenter from "../../pages/call-center/CallCenter";
import Booking from "../../pages/booking/Booking";

const AppRoutes: React.FC = () => {
  const { loading } = useAuth();
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Router>
      <Routes>
        {/* Authflow Layout */}
        <Route element={<AuthFlow />}>
          <Route path={routes.auth.verifyEmail} element={<VerifyEmail />} />

          <Route path={routes.auth.stepForm} element={<StepForm />} />
        </Route>
        {/* Guest Layout (For Unauthenticated Users Only) */}
        <Route element={<GuestRoute />}>
          <Route element={<AnonymousLayout />}>
            <Route path={routes.auth.signIn} element={<Login />} />
            <Route path={routes.auth.signUp} element={<SignUp />} />
            <Route
              path={routes.auth.forgotPassword}
              element={<ResetPassword />}
            />
          </Route>
        </Route>

        {/* Protected Routes (Only for Authenticated & Verified Users) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path={routes.dashboard.home} element={<Booking />} />
            <Route path={routes.sidebar.schedule.link} element={<Schedule />} />
            <Route
              path={routes.sidebar.callCenter.link}
              element={<CallCenter />}
            />
            <Route path={routes.sidebar.bookings.link} element={<Booking />} />
          </Route>
        </Route>

        {/* Catch-all route */}
        <Route path={routes.error.notFound} element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
