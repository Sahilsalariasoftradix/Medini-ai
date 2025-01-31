import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firebaseAuth, firebaseFirestore } from "./BaseConfig";
import {
  emailCheckingError,
  emailCheckingErrorPlaceholder,
  emailNotExistMessage,
  emailNotVerifiedMessage,
  errorFetchingReasonsMessage,
  errorFetchingReasonsMessageText,
  getAuthErrorMessage,
  onBoardingFieldNotFoundMessage,
  onboardingStatusError,
  onboardingStatusErrorMessage,
  updateUserError,
  updateUserErrorPlaceholder,
  userDocDoesNotExistMessage,
} from "../utils/errorHandler";
import { IUserDetails } from "../types/api/Interfaces";
import { staticText } from "../utils/staticText";
import {
  EnFirebaseCollections,
  EnOnboardingStatus,
  EnVerifiedStatus,
} from "../utils/enums";

//* Function to get the Onboarding Status
export const getOnboardingStatus = async (userId: string): Promise<number> => {
  try {
    // Reference to the user's document in Firestore using the provided userId
    const userRef = doc(firebaseFirestore, EnFirebaseCollections.USERS, userId); // Replace "users" with the correct collection name if needed

    // Fetch the document snapshot for the specified user
    const userDoc = await getDoc(userRef);

    // Check if the user document exists in the Firestore database
    if (userDoc.exists()) {
      // Retrieve the onboardingStatus field from the document data
      const onboardingStatus = userDoc.data()?.onboardingStatus; // Assuming the field is called "onboardingStatus"
      // If onboardingStatus exists, return its value
      if (onboardingStatus !== undefined) {
        return onboardingStatus; // Return the onboarding status
      } else {
        // If onboardingStatus is missing in the document, throw an error
        throw new Error(onBoardingFieldNotFoundMessage); // Custom error message for missing field
      }
    } else {
      // If the document does not exist (user not found), throw an error
      throw new Error(userDocDoesNotExistMessage); // Custom error message for missing user document
    }
  } catch (error: any) {
    // Log any errors that occur during the process for debugging purposes
    console.error(onboardingStatusErrorMessage, error.message);
    // Rethrow the error with a generic error message
    throw new Error(onboardingStatusError); // Generic error message to be thrown after logging
  }
};

//* Function to check if the email exists in the Firestore 'users' collection
const checkIfEmailExists = async (email: string) => {
  // Get a reference to the Firestore database
  const db = getFirestore();
  // Reference to the 'users' collection in Firestore
  const usersRef = collection(db, EnFirebaseCollections.USERS);
  // Create a query to search for a document where the 'email' field matches the provided email
  const q = query(usersRef, where("email", "==", email));

  try {
    // Execute the query and get the querySnapshot, which contains the results
    const querySnapshot = await getDocs(q);
    // If querySnapshot is not empty, it means an email match was found in the collection
    return !querySnapshot.empty; // Returns true if the email exists, false otherwise
  } catch (error) {
    // Log any errors that occur during the check for debugging purposes
    console.error(emailCheckingErrorPlaceholder, error);
    // Rethrow the error with a generic message if something goes wrong
    throw new Error(emailCheckingError); // Custom error message for the email checking operation
  }
};

//* Function to get the current user's UID from Firebase Authentication
export const getCurrentUserId = (): string | null => {
  // Access the currently authenticated user from Firebase Authentication
  const user = firebaseAuth.currentUser;
  // If a user is authenticated, return their UID; otherwise, return null
  return user ? user.uid : null; // user.uid contains the unique identifier for the authenticated user
};


//* Function to update a user's details in the Firestore database
export const updateUserDetailsInFirestore = async (
  userId: string, // User ID to identify the document to update
  userDetails: Partial<IUserDetails> // Using Partial to allow updating only some of the user's details
): Promise<void> => {
  try {
    // Create an update object by spreading the provided userDetails
    // Add the updated timestamp and set the onboardingStatus to a default value
    const userDocUpdate = {
      ...userDetails, // Merge the provided user details with other fields
      updatedAt: serverTimestamp(), // Add a server-generated timestamp for the update time
      // onboardingStatus: EnOnboardingStatus.STATUS_1, // Set onboarding status to a default value (STATUS_1)
    };

    // Reference to the specific user's document in Firestore using the userId
    const userRef = doc(firebaseFirestore, EnFirebaseCollections.USERS, userId);

    // Update the user document in Firestore with the new details
    await updateDoc(userRef, userDocUpdate);

    // console.log("User details successfully updated in Firestore!");
  } catch (error) {
    // Log any errors that occur during the update process for debugging
    console.error(updateUserErrorPlaceholder, error);
    // Rethrow the error with a custom error message
    throw new Error(updateUserError); // Custom error message for failed update operation
  }
};

//* Function to fetch all reasons from the Firestore 'reasons' collection
export const getReasons = async () => {
  // Get a reference to the Firestore database
  const db = getFirestore();
  // Reference to the 'reasons' collection in Firestore
  const reasonsCollection = collection(db, EnFirebaseCollections.REASONS);

  try {
    // Fetch all documents from the 'reasons' collection
    const snapshot = await getDocs(reasonsCollection);
    // Map through the documents in the snapshot and create an array of reason objects
    const reasonsList = snapshot.docs.map((doc) => ({
      id: doc.id, // Include the document ID for each reason
      ...doc.data(), // Include the rest of the document's data
    }));
    // Return the list of reasons
    return reasonsList;
  } catch (error) {
    // Log an error message if something goes wrong during the fetch
    console.error(errorFetchingReasonsMessage, error);
    // Rethrow the error with a custom error message
    throw new Error(errorFetchingReasonsMessageText); // Custom error message for failed fetching operation
  }
};

// Function to sign up a user with email and password, create their Firestore document, and send verification email
export const signUpWithEmail = async (
  email: string, // User's email address
  password: string, // User's password
  firstName: string, // User's first name
  lastName: string // User's last name
): Promise<string | void> => {
  try {
    // Step 1: Create the user in Firebase Authentication using email and password
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth, // Firebase Auth instance
      email, // User's email
      password // User's password
    );
    // Get the user object from the created userCredential
    const user = userCredential.user;
    // Optionally, sign out the user immediately after account creation if you don't want them signed in
    await signOut(firebaseAuth);

    // Step 2: Save the user's details in Firestore
    const userData = {
      id: user.uid, // Firebase user ID
      email: user.email, // User's email
      firstName, // User's first name
      lastName, // User's last name
      createdAt: Timestamp.now().seconds, // UNIX timestamp for account creation
      updatedAt: null, // Initially null
      deletedAt: null, // Initially null
      status: EnVerifiedStatus.UNVERIFIED, // 1 for verified 0 for unverified
      onboardingStatus: EnOnboardingStatus.STATUS_0, //0 for unverified 1 for verified 2 for second verified
    };
    // Set the user data in the Firestore 'users' collection using the user's UID
    await setDoc(
      doc(firebaseFirestore, EnFirebaseCollections.USERS, user.uid),
      userData
    );

    // Step 3: Send an email verification to the user
    await sendEmailVerification(user);

    
    // Step 4: Return a success message
    return `Welcome, ${firstName}${" "}${lastName}! ${
      staticText.firestore.accountSucceededMessage
    }`;
  } catch (error: any) {
    // Step 5: Handle errors by throwing a custom error message
    throw new Error(getAuthErrorMessage(error.code)); // Map Firebase error code to a custom message
  }
};

//* Function to sign in a user with email and password, verify email, and update Firestore status
export const signInWithEmail = async (
  email: string, // User's email address
  password: string // User's password
): Promise<string> => {
  try {
    // Step 1: Attempt to sign the user in with Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth, // Firebase Auth instance
      email, // User's email
      password // User's password
    );
    // Get the user object from the credential
    const user = userCredential.user;

    // Step 2: Check if email is verified
    if (!user.emailVerified) {
      await signOut(firebaseAuth); // Immediately sign out the user if the email is not verified
      const message = emailNotVerifiedMessage; // Message you return when email isn't verified
      throw new Error(message); // Throw an error so it can be caught in your `onSubmit` handler
    }

    // Step 3: If email is verified, update the user's status in Firestore
    const userRef = doc(
      firebaseFirestore,
      EnFirebaseCollections.USERS,
      user.uid
    );
    // Update the status to "verified" in the Firestore document
    await updateDoc(userRef, { status: EnVerifiedStatus.VERIFIED });

    // Step 4: Return success message
    const successMessage = staticText.firestore.successLoggedInMessage; // Custom success message
    return successMessage; // Return the success message after successful login
  } catch (error: any) {
    // Step 5: Handle errors and log them for debugging
    const errorMessage = getAuthErrorMessage(error.code); // Map the Firebase error code to a user-friendly message
    console.error(errorMessage); // Log the error message to the console for debugging
    throw new Error(errorMessage); // Rethrow the error with the custom error message for handling in the UI
  }
};

// * Function to reset a user's password by sending a password reset email
export const resetPasswordWithEmail = async (
  email: string // User's email address to send the reset link to
): Promise<string> => {
  try {
    // Step 1: Check if the email exists in Firestore
    const emailExists = await checkIfEmailExists(email); // Check if the email is registered

    if (!emailExists) {
      // If the email is not found in Firestore, throw an error
      throw new Error(emailNotExistMessage); // Custom error message when email doesn't exist
    }

    // Step 2: If the email exists, send the password reset email
    await sendPasswordResetEmail(firebaseAuth, email); // Firebase function to send the reset email
    // Return a success message after the email is sent
    return staticText.firestore.passwordResetText; // Custom success message (e.g., "Password reset email sent")
  } catch (error: any) {
    // Step 3: Handle any errors that occur during the process
    // Convert Firebase error codes to user-friendly error messages
    throw new Error(getAuthErrorMessage(error.code)); // Throw a custom error for UI handling
  }
};

//* Google sign-in function using Firebase Authentication
export const signInWithGoogle = async (): Promise<string | void> => {
  try {
    // Step 1: Create an instance of the GoogleAuthProvider for Google sign-in
    const provider = new GoogleAuthProvider(); // GoogleAuthProvider is used to configure the Google sign-in

    // Step 2: Trigger the Google sign-in popup
    await signInWithPopup(firebaseAuth, provider); // This opens a popup for the user to sign in with Google

    // Step 3: Return a success message after successful sign-in
    return staticText.firestore.signInWithGoogleMessage; // Custom success message (e.g., "Successfully signed in with Google")
  } catch (error: any) {
    // Step 4: Handle any errors that occur during the sign-in process
    // Convert the Firebase error code to a user-friendly error message
    throw new Error(getAuthErrorMessage(error.code)); // Throw the error for UI handling
  }
};

//* Apple sign-in function using Firebase Authentication
export const signInWithApple = async (): Promise<string | void> => {
  try {
    // Step 1: Create an instance of the OAuthProvider for Apple sign-in
    const provider = new OAuthProvider("apple.com"); // OAuthProvider is used for Apple authentication with Firebase

    // Step 2: Trigger the Apple sign-in popup
    await signInWithPopup(firebaseAuth, provider); // This opens a popup for the user to sign in with Apple

    // Step 3: Return a success message after successful sign-in
    return staticText.firestore.signInWithAppMessage; // Custom success message (e.g., "Successfully signed in with Apple")
  } catch (error: any) {
    // Step 4: Handle any errors that occur during the sign-in process
    // Convert the Firebase error code to a user-friendly error message
    throw new Error(getAuthErrorMessage(error.code)); // Throw the error for UI handling
  }
};
