// Internal Links (routes)
export const routes = {
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    forgotPassword: "/auth/forgot-password",
    verifyEmail: "/auth/verify-email",
    stepForm:'/auth/onboarding'
  },
  dashboard: {
    home: "/",
    profile: "/dashboard/profile",
    settings: "/dashboard/settings",
  },
  error: {
    notFound: "*",
  },
};

// External Links
export const externalLinks = {
  privacyPolicy: "https://www.example.com/privacy-policy",
  termsOfService: "https://www.example.com/terms-of-service",
};

// Exports all links as a single object for easy import
const links = {
  routes,
  externalLinks,
};

export default links;
