import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  OAuthProvider,
  signInWithPopup,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc, Timestamp, updateDoc } from "firebase/firestore";
import { firebaseAuth, firebaseFirestore } from "./BaseConfig";
import { getAuthErrorMessage } from "../utils/errorHandler";

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
      status: 0, // 1 for verified 0 for unverified
    };

    await setDoc(doc(firebaseFirestore, "users", user.uid), userData);

    // Step 3: Send email verification
    await sendEmailVerification(user);

    // Step 3: Return success message
    return `Welcome, ${user.email}! Account created successfully.`;
  } catch (error: any) {
    // Step 4: Handle errors
    throw new Error(getAuthErrorMessage(error.code));
  }
};


//* Sign in function firebase
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
      const message =
        "Your email is not verified. Please verify your email to access your account.";
    //   await sendEmailVerification(user);
      return message; // Return the message for further handling (e.g., snackbar or alert)
    }

    // Step 3: Update Firestore status for verified users
    const userRef = doc(firebaseFirestore, "users", user.uid);
    await updateDoc(userRef, { status: 1 });

    // Step 4: Return success message
    const successMessage = "Welcome back! You are successfully logged in.";
    console.log(successMessage);
    return successMessage;
  } catch (error: any) {
    console.log("🚀 ~ error:", error)
    // Step 5: Handle errors and throw a meaningful message
    const errorMessage = getAuthErrorMessage(error.code);
    console.error(errorMessage);
    throw new Error(errorMessage); // Pass error for UI handling
  }
};

//* Google sign in function firebase
export const signInWithGoogle = async (): Promise<string | void> => {
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(firebaseAuth, provider);
    return "Successfully signed in with Google!";
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};
//* Apple sign in function firebase
export const signInWithApple = async (): Promise<string | void> => {
  try {
    const provider = new OAuthProvider("apple.com");
    await signInWithPopup(firebaseAuth, provider);
    return "Successfully signed in with Apple!";
  } catch (error: any) {
    throw new Error(getAuthErrorMessage(error.code));
  }
};
