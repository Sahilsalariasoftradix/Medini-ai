// Override the error messages give by firebase
export const getAuthErrorMessage = (errorCode: string): string => {
  console.log(errorCode)
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
    case "not-found":
      return "User not found. Please sign up.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};
// Firestore errors
export const emailCheckingErrorPlaceholder =
  "Error checking email in Firestore:";
export const emailCheckingError = "Error checking email in Firestore.";
export const updateUserErrorPlaceholder =
  "Error updating user details in Firestore:";
export const updateUserError =
  "Failed to update user details. Please try again.";
export const errorFetchingReasonsMessageText =
  "Error fetching user details from Firestore";

// Data fetching error message
export const fetchingReasonsErrorMessage =
  "Error while fetching data please try again later";
// User already exists error message
export const collaboratorsErrorMessage =
  "This email is already in the collaborators list.";

export const errorFetchingReasonsMessage = "Error fetching reasons:";
export const emailNotVerifiedMessage =
  "Your email is not verified. Please verify your email to access your account.";
export const emailNotExistMessage =
  "Looks like this email isn't registered with us. Please check and enter the correct one.";
export const userNotSignedInErrorMessage = "User is not signed in.";
export const errorSavingUserDetailsMessage =
  "Error saving user details to Firestore:";
export const onBoardingFieldNotFoundMessage =
  "onboardingStatus field is not found.";
export const userDocDoesNotExistMessage = "User document does not exist.";
export const onboardingStatusErrorMessage = "Error fetching onboardingStatus";
export const onboardingStatusError = "Unable to fetch onboarding status.";
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
  "Looks like this email isn't registered with us. Please check and enter the correct one.";

// Auth forms error messages
export const formErrorMessage = {
  email: {
    required: "Email is required",
    invalid: "Invalid email format",
  },
  firstName: {
    required: "First name is required",
    tooLong: "First name is too long",
  },
  lastName: {
    required: "Last name is required",
    tooLong: "Last name is too long",
  },
  password: {
    required: "Password is required",
    tooShort: "Password must be at least 8 characters",
    errorMessage: "Invalid password format",
  },
  phone: {
    required: "Phone number is required",
    tooLong: "Phone number is too long",
  },
};
