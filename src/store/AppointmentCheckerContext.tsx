import { createContext, useContext, useEffect, useState } from "react";
import { z } from "zod";
import { getCompanyDetails } from "../api/userApi";
import { ICompanyData, ICompanyUsers } from "../utils/Interfaces";

// Define the shape of the context data
interface AppointmentCheckerContextType {
  step: number;
  appointmentData: AppointmentData;
  phone: string;
  flowType: "new" | "existing" | null;
  hasAppointment: boolean | null;
  setStep: (step: number) => void;
  setFlowType: (type: "new" | "existing" | null) => void;
  setHasAppointment: (value: boolean | null) => void;
  updateAppointmentData: (data: Partial<AppointmentData>) => void;
  resetAppointmentData: () => void;
  setExistingAppointmentData: (data: ExistingAppointmentData) => void;
  existingAppointmentData: ExistingAppointmentData | null;
  newAppointmentData: NewAppointmentData | null;
  setNewAppointmentData: (data: NewAppointmentData) => void;
  setPhone: (phone: string) => void;
  snackbar: {
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  };
  setSnackbar: (snackbar: {
    open: boolean;
    message: string;
    severity: "success" | "error" | "warning" | "info";
  }) => void;
  existingPhone: string;
  setExistingPhone: (phone: string) => void;
  companyDetails: ICompanyData[];
  practitioners: ICompanyUsers[];
  setPractitioners: (practitioners: ICompanyUsers[]) => void;
  setReferenceNumber: (referenceNumber: string) => void;
  referenceNumber: string;
  userBookings: any[];
  setUserBookings: (userBookings: any[]) => void;
  timer: number;
  isResendDisabled: boolean;
  startTimer: () => void;
  setTimer: (timer: number) => void;
  setIsResendDisabled: (isResendDisabled: boolean) => void;
}
export const EditAppointmentSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email address"),
  bypass_key: z.string().optional(),
  appointment_location: z.string().min(1, "Appointment location is required"),
  appointmentType: z.string().min(1, "Appointment type is required"),
  date: z.string().min(1, "Date is required"),
  time: z.string().min(1, "Time is required"),
  length: z.string().min(1, "Appointment length is required"),
});

export type EditAppointmentSchemaType = z.infer<typeof EditAppointmentSchema>;
interface AppointmentData {
  businessName: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  appointmentType: "phone" | "in-person" | "";
  appointmentDate: string;
  appointmentTime: string;
  clinicLocation: string;
  appointmentStatus?: "scheduled" | "confirmed" | "completed" | "cancelled";
  referenceNumber?: string;
}

const defaultAppointmentData: AppointmentData = {
  businessName: "",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  dateOfBirth: "",
  appointmentType: "",
  appointmentDate: "",
  appointmentTime: "",
  clinicLocation: "",
};
export interface NewAppointmentData {
  details: string;
  appointment_location: string;
  day: string;
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  practitioner: string;
  date: string;
  time: string;
  appointmentLength: string;
  appointmentType: string;
  dateOfBirth: string;
  bypass_key: string;
  referenceNumber: string;
}
export interface ExistingAppointmentData {
  phone: string;
  email: string;
  appointment_location: string;
}

const AppointmentCheckerContext = createContext<
  AppointmentCheckerContextType | undefined
>(undefined);

export const AppointmentCheckerProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [step, setStep] = useState(1);
  const [appointmentData, setAppointmentData] = useState<AppointmentData>(
    defaultAppointmentData
  );
  const [flowType, setFlowType] = useState<"new" | "existing" | null>(null);

  const [phone, setPhone] = useState<string>("");
  const [existingPhone, setExistingPhone] = useState<string>("");
  const [hasAppointment, setHasAppointment] = useState<boolean | null>(null);
  const [companyDetails, setCompanyDetails] = useState<ICompanyData[]>([]);

  const [practitioners, setPractitioners] = useState<ICompanyUsers[]>([]);
  const [referenceNumber, setReferenceNumber] = useState<string>("");
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [timer, setTimer] = useState(60); // Timer duration in seconds
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const startTimer = () => {
    setIsResendDisabled(true);
    setTimer(60);
  };
  const [existingAppointmentData, setExistingAppointmentData] =
    useState<ExistingAppointmentData | null>(null);

  const updateAppointmentData = (data: Partial<AppointmentData>) => {
    setAppointmentData((prev) => ({ ...prev, ...data }));
  };
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "warning" | "info",
  });
  const [newAppointmentData, setNewAppointmentData] =
    useState<NewAppointmentData | null>(null);

  const resetAppointmentData = () => {
    setAppointmentData(defaultAppointmentData);
    setStep(1);
    setFlowType(null);
    setHasAppointment(null);
  };
  useEffect(() => {
    (async () => {
      const companyDetails = await getCompanyDetails();
      setCompanyDetails(companyDetails?.companies);
    })();
  }, []);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResendDisabled && timer > 0) {
      interval = setInterval(() => {
        //@ts-ignore
        setTimer((prev: number) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsResendDisabled(false);
    }

    return () => clearInterval(interval);
  }, [timer, isResendDisabled]);
  return (
    <AppointmentCheckerContext.Provider
      value={{
        step,
        appointmentData,
        flowType,
        hasAppointment,
        setStep,
        setFlowType,
        setHasAppointment,
        updateAppointmentData,
        resetAppointmentData,
        setExistingAppointmentData,
        existingAppointmentData,
        newAppointmentData,
        setNewAppointmentData,
        phone,
        setPhone,
        snackbar,
        setSnackbar,
        existingPhone,
        setExistingPhone,
        companyDetails,
        practitioners,
        setPractitioners,
        setReferenceNumber,
        referenceNumber,
        userBookings,
        setUserBookings,
        timer,
        isResendDisabled,
        startTimer,
        setTimer,
        setIsResendDisabled,
      }}
    >
      {children}
    </AppointmentCheckerContext.Provider>
  );
};

export const useAppointmentChecker = () => {
  const context = useContext(AppointmentCheckerContext);
  if (!context) {
    throw new Error(
      "useAppointmentChecker must be used within an AppointmentCheckerProvider"
    );
  }
  return context;
};
