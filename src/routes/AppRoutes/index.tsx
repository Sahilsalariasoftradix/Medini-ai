import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AnonymousLayout from "../../layouts/AnonymousLayout";
import Login from "../../pages/Auth/Login";
import MainLayout from "../../layouts/MainLayout";
import Home from "../../pages/Home";
import AuthFlow from "../../layouts/AuthFlowLayout";
import VerifyEmail from "../../pages/verification/verify-email";
import SignUp from "../../pages/Auth/sign-up";
import ResetPassword from "../../pages/Auth/reset-password";
import { routes } from "../../utils/links";
import NotFoundPage from "../../pages/NotFound";
import StepForm from "../../components/StepForm/StepForm";

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Authflow Layout */}
        <Route element={<AuthFlow />}>
          <Route path={routes.auth.verifyEmail} element={<VerifyEmail />} />
          <Route
            path={routes.auth.forgotPassword}
            element={<ResetPassword />}
          />
          <Route path={routes.auth.stepForm} element={<StepForm />} />
        </Route>
        {/* Auth Layout */}
        <Route element={<AnonymousLayout />}>
          <Route path={routes.auth.signIn} element={<Login />} />
          <Route path={routes.auth.signUp} element={<SignUp />} />
        </Route>

        {/* Dashboard Layout */}
        <Route element={<MainLayout />}>
          <Route path={routes.dashboard.home} element={<Home />} />
        </Route>

        {/* Catch-all route */}
        <Route path={routes.error.notFound} element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
