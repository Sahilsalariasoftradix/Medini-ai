import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { firebaseFirestore } from "./BaseConfig";
import { EnFirebaseCollections } from "../utils/enums";
import { INewContactData } from "../utils/Interfaces";

interface AppointmentData {
  userId: string;
  contact: string;
  date: string;
  startTime: string;
  endTime: string;
  length: string;
  appointmentType: string;
  reasonForCall: string;
  status: string;
  createdAt?: Date;
}

export const checkSlotAvailability = async (
  userId: string,
  date: string,
  startTime: string
): Promise<boolean> => {
  try {
    const appointmentsRef = collection(
      firebaseFirestore,
      EnFirebaseCollections.APPOINTMENTS
    );
    const q = query(
      appointmentsRef,
      where("userId", "==", userId),
      where("date", "==", date),
      where("startTime", "==", startTime)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.empty; // Returns true if slot is available
  } catch (error) {
    console.error("Error checking slot availability:", error);
    throw new Error("Failed to check slot availability");
  }
};

export const createAppointment = async (
  userId: string,
  appointmentData: Omit<AppointmentData, "userId" | "createdAt">
): Promise<string> => {
  try {
    // Check if slot is available before creating appointment
    const isAvailable = await checkSlotAvailability(
      userId,
      appointmentData.date,
      appointmentData.startTime
    );

    if (!isAvailable) {
      throw new Error("This time slot is already booked");
    }

    const appointmentRef = collection(
      firebaseFirestore,
      EnFirebaseCollections.APPOINTMENTS
    );

    const docRef = await addDoc(appointmentRef, {
      userId,
      ...appointmentData,
      createdAt: serverTimestamp(),
    });

    return docRef.id;
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

export const createNewContact = async (
  contactData: INewContactData
): Promise<string> => {
  try {
    const createContactRef = collection(
      firebaseFirestore,
      EnFirebaseCollections.CONTACTS
    );
    // Check if the phone number already exists
    const phoneQuery = query(
      createContactRef,
      where("user_id", "==", contactData?.user_id),
      where("phone", "==", contactData.phone)
    );
    const querySnapshot = await getDocs(phoneQuery);
    if (!querySnapshot.empty) {
      throw new Error(
        "Phone number already exists. Please use a different number."
      );
    }
    // Create a new document in Firestore
    const docRef = await addDoc(createContactRef, {
      ...contactData,
      createdAt: serverTimestamp(),
    });

    // Return the newly created document's ID
    return docRef.id;
  } catch (error) {
    console.error("Error creating new contact:", error);
    throw new Error("Failed to create new contact"); // Throwing a custom error message
  }
};

export const getAppointmentsByDateRange = async (
  userId: string,
  startDate: string,
  endDate: string
) => {
  try {
    const appointmentsRef = collection(
      firebaseFirestore,
      EnFirebaseCollections.APPOINTMENTS
    );
    const q = query(
      appointmentsRef,
      where("userId", "==", userId),
      where("date", ">=", startDate),
      where("date", "<=", endDate)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw new Error("Failed to fetch appointments");
  }
};

export const getAppointmentsForDay = async (userId: string, date: string) => {
  try {
    const appointmentsRef = collection(
      firebaseFirestore,
      EnFirebaseCollections.APPOINTMENTS
    );
    const q = query(
      appointmentsRef,
      where("userId", "==", userId),
      where("date", "==", date)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw new Error("Failed to fetch appointments");
  }
};

export const updateAppointmentStatus = async (
  appointmentId: string,
  status: string,
  cancelReason?: string
) => {
  try {
    const appointmentRef = doc(
      firebaseFirestore,
      EnFirebaseCollections.APPOINTMENTS,
      appointmentId
    );

    const updateData: any = { status };

    if (cancelReason) {
      updateData.cancelReason = cancelReason;
    }

    await updateDoc(appointmentRef, updateData);
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};
