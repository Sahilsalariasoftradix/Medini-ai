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
    // Reference to the user's document in Firestore
    const userRef = doc(firebaseFirestore, EnFirebaseCollections.USERS, userId); // Replace "users" with the correct collection name if needed

    // Get the document snapshot
    const userDoc = await getDoc(userRef);

    // Check if the document exists
    if (userDoc.exists()) {
      // Get the onboardingStatus from the document data
      const onboardingStatus = userDoc.data()?.onboardingStatus; // Assuming the field is called "onboardingStatus"

      if (onboardingStatus !== undefined) {
        return onboardingStatus; // Return the onboarding status (true or false)
      } else {
        throw new Error(onBoardingFieldNotFoundMessage);
      }
    } else {
      throw new Error(userDocDoesNotExistMessage);
    }
  } catch (error: any) {
    console.error(onboardingStatusErrorMessage, error.message);
    throw new Error(onboardingStatusError);
  }
};

//* Function to check if the email exists in the Firestore 'users' collection
const checkIfEmailExists = async (email: string) => {
  const db = getFirestore();
  const usersRef = collection(db, EnFirebaseCollections.USERS);
  const q = query(usersRef, where("email", "==", email));

  try {
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty; // Returns true if the email exists, false otherwise
  } catch (error) {
    console.error(emailCheckingErrorPlaceholder, error);
    throw new Error(emailCheckingError);
  }
};
// Current user
export const getCurrentUserId = (): string | null => {
  const user = firebaseAuth.currentUser;
  return user ? user.uid : null;
};

// Update the user doc with other details
export const updateUserDetailsInFirestore = async (
  userId: string,
  userDetails: Partial<IUserDetails> // Using Partial to allow partial updates
): Promise<void> => {
  try {
    // Created an update object with the new details and timestamps
    const userDocUpdate = {
      ...userDetails,
      updatedAt: serverTimestamp(),
      onboardingStatus: EnOnboardingStatus.STATUS_1,
    };

    // Reference the user's document in Firestore
    const userRef = doc(firebaseFirestore, EnFirebaseCollections.USERS, userId);

    // Updated the document with the new details
    await updateDoc(userRef, userDocUpdate);

    // console.log("User details successfully updated in Firestore!");
  } catch (error) {
    console.error(updateUserErrorPlaceholder, error);
    throw new Error(updateUserError);
  }
};
export const getReasons = async () => {
  const db = getFirestore();
  const reasonsCollection = collection(db, EnFirebaseCollections.REASONS);

  try {
    const snapshot = await getDocs(reasonsCollection);
    const reasonsList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return reasonsList;
  } catch (error) {
    console.error(errorFetchingReasonsMessage, error);
  }
};

// Sign-up function
export const signUpWithEmail = async (
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<string | void> => {
  try {
    // Step 1: Create user in Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );

    const user = userCredential.user;

    // Step 2: Save user details in Firestore
    const userData = {
      id: user.uid, // Firebase user ID
      email: user.email,
      firstName,
      lastName,
      createdAt: Timestamp.now().seconds, // UNIX timestamp
      updatedAt: null, // Initially null
      deletedAt: null, // Initially null
      status: EnVerifiedStatus.UNVERIFIED, // 1 for verified 0 for unverified
      onboardingStatus: EnOnboardingStatus.STATUS_0, //0 for unverified 1 for verified 2 for second verified
    };

    await setDoc(
      doc(firebaseFirestore, EnFirebaseCollections.USERS, user.uid),
      userData
    );

    // Step 3: Send email verification
    await sendEmailVerification(user);

    // Optionally, sign the user out immediately if you don't want to keep them signed in
    await signOut(firebaseAuth);
    // Step 3: Return success message
    return `Welcome, ${firstName}${" "}${lastName}! ${
      staticText.firestore.accountSucceededMessage
    }`;
  } catch (error: any) {
    // Step 4: Handle errors
    throw new Error(getAuthErrorMessage(error.code));
  }
};

//* Sign in function firebase
// export const signInWithEmail = async (
//   email: string,
//   password: string
// ): Promise<string> => {
//   try {
//     // Step 1: Attempt to sign the user in
//     const userCredential = await signInWithEmailAndPassword(
//       firebaseAuth,
//       email,
//       password
//     );
//     const user = userCredential.user;

//     // Step 2: Check if email is verified
//     if (!user.emailVerified) {
//       const message = emailNotVerifiedMessage;
//       //? Might need later
//       //   await sendEmailVerification(user);
//       return message; // Return the message for further handling (e.g., snackbar or alert)
//     }

//     // Step 3: Update Firestore status for verified users
//     const userRef = doc(
//       firebaseFirestore,
//       FirebaseCollections.USERS,
//       user.uid
//     );
//     await updateDoc(userRef, { status: 1 });

//     // Step 4: Return success message
//     const successMessage = staticText.firestore.successLoggedInMessage;
//     return successMessage;
//   } catch (error: any) {
//     // Step 5: Handle errors and throw a meaningful message
//     const errorMessage = getAuthErrorMessage(error.code);
//     console.error(errorMessage);
//     throw new Error(errorMessage); // Pass error for UI handling
//   }
// };
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    // Step 1: Attempt to sign the user in
    const userCredential = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      password
    );
    const user = userCredential.user;

    // Step 2: Check if email is verified
    if (!user.emailVerified) {
      await signOut(firebaseAuth); // Immediately sign out the user if the email is not verified
      const message = emailNotVerifiedMessage; // Message you return when email isn't verified
      throw new Error(message); // Throw an error so it can be caught in your `onSubmit` handler
    }

    // Step 3: Update Firestore status for verified users
    const userRef = doc(
      firebaseFirestore,
      EnFirebaseCollections.USERS,
      user.uid
    );
    await updateDoc(userRef, { status: EnVerifiedStatus.VERIFIED });

    // Step 4: Return success message
    const successMessage = staticText.firestore.successLoggedInMessage;
    return successMessage;
  } catch (error: any) {
    // Step 5: Handle errors and throw a meaningful message
    const errorMessage = error.message || getAuthErrorMessage(error.code);
    console.error(errorMessage);
    throw new Error(errorMessage); // This will allow you to catch the error in the `onSubmit` handler
  }
};

// * Reset Password
export const resetPasswordWithEmail = async (
  email: string
): Promise<string> => {
  try {
    // Step 1: Check if the email exists in Firestore
    const emailExists = await checkIfEmailExists(email);

    if (!emailExists) {
      // If the email is not registered, throw an error
      throw new Error(emailNotExistMessage);
    }

    // Step 2: If the email exists, send the password reset email
    await sendPasswordResetEmail(firebaseAuth, email);
    return staticText.firestore.passwordResetText;
  } catch (error: any) {
    // Handle any errors
    throw new Error(getAuthErrorMessage(error.code));
  }
};

//* Google sign in function firebase
export const signInWithGoogle = async (): Promise<string | void> => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(firebaseAuth, provider);
    return staticText.firestore.signInWithGoogleMessage;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};
//* Apple sign in function firebase
export const signInWithApple = async (): Promise<string | void> => {
  try {
    const provider = new OAuthProvider("apple.com");
    await signInWithPopup(firebaseAuth, provider);
    return staticText.firestore.signInWithAppMessage;
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};
