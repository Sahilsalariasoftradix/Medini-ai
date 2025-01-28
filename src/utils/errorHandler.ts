// Override the error messages give by firebase
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
    case "auth/too-many-requests":
      return "Too many requests. Please try again later.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};
// Data fetching error message
export const fetchingReasonsErrorMessage =
  "Error while fetching data please try again later";
// User already exists error message
export const collaboratorsErrorMessage =
  "This email is already in the collaborators list.";

// Auth Page error messages
export const firstNameErrorMessage = "First name is required";
export const firstNameTooLongMessage = "First name is too long";
export const lastNameErrorMessage = "Last name is required";
export const lastNameTooLongMessage = "Last name is too long";

// Unexpected error
export const unexpectedErrorMessage = "An error occurred. Please try again.";
// Registration Message
export const successfullyRegisteredMessage = "Successfully registered!";
// Credentials Required Message
export const credentialsRequiredMessage = "mail and password are required.";

// Reset password page messages
export const resetPasswordEmailSentMessage =
  "Password reset link sent successfully. Please check your email";
export const resetPasswordEmailAlreadyRegisteredMessage =
  "Looks like this email isn’t registered with us. Please check and enter the correct one.";
