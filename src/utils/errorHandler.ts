export const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case "auth/email-already-in-use":
      return "This email is already in use. Please use a different email.";
    case "auth/invalid-credential":
      return "Credentials are invalid";
    case "auth/invalid-email":
      return "The email address is invalid. Please check and try again.";
    case "auth/weak-password":
      return "The password is too weak. Please use at least 6 characters.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    case "auth/user-not-found":
      return "No user found with this email. Please sign up.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    case "auth/popup-closed-by-user":
      return "Sign-in popup was closed before completing the process.";
    case "auth/cancelled-popup-request":
      return "Another popup is already open. Please wait.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};
