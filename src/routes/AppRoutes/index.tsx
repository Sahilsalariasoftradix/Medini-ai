import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AnonymousLayout from '../../layouts/AnonymousLayout';
import Login from '../../pages/Auth/Login';
import MainLayout from '../../layouts/MainLayout';
import Home from '../../pages/Home';
import AuthFlow from '../../layouts/AuthFlowLayout';
import VerifyEmail from '../../pages/verification/verify-email';



const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Authflow Layout */}
        <Route element={<AuthFlow />}>
          <Route path="/verify" element={<VerifyEmail />} />
        </Route>
        {/* Auth Layout */}
        <Route element={<AnonymousLayout />}>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<Signup />} /> */}
        </Route>

        {/* Dashboard Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Catch-all route */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
