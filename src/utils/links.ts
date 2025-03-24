// Internal Links (routes)
export const routes = {
  appointmentChecker: {
    stepForm: "/user-booking",
  },
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    forgotPassword: "/auth/forgot-password",
    verifyEmail: "/auth/verify-email",
    stepForm: "/auth/onboarding",
  },
  dashboard: {
    home: "/",
    profile: "/dashboard/profile",
    settings: "/dashboard/settings",
    messages: "/dashboard/messages",
  },
  sidebar: {
    schedule: { name: "Schedule", link: "/schedule" },
    bookings: { name: "Bookings", link: "/bookings" },
    callCenter: { name: "Call Center", link: "/call-center" },
    activity1: { name: "Activity 1", link: "/activity1" },
    activity2: { name: "Activity 2", link: "/activity2" },
    billing: { name: "Billing", link: "/billing" },
    patients: { name: "Patients", link: "/patients" },
    history: { name: "History", link: "/history" },
    messages: { name: "Messages", link: "/messages" },
    settings: { name: "Settings", link: "/settings" },
    help: { name: "Help", link: "/help" },
  },
  error: {
    notFound: "*",
  },
};

// External Links
export const externalLinks = {
  privacyPolicy: "/privacy-policy",
  termsOfService: "/terms-of-service",
};

// Exports all links as a single object for easy import
const links = {
  routes,
  externalLinks,
};

export default links;
