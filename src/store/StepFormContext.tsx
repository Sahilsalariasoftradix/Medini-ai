import { createContext, useContext, useEffect, useState } from "react";
import { IStepFormContextType, IUserDetails } from "../utils/Interfaces";
import { z } from "zod";
import { EnOnboardingStatus } from "../utils/enums";
import { useAuth } from "./AuthContext";

const StepFormContext = createContext<IStepFormContextType | undefined>(
  undefined
);
// Validation Schema
export const CompanyDetailsSchema = z.object({
  company_name: z
    .string()
    .min(8, "Office name should be at least 8 characters")
    .max(50, "Office name can be up to 50 characters"),
  address_line_one: z
    .string().min(1, "Address is required")
    .max(50, "Apartment name can be up to 50 characters"),
  address_line_two: z.string().optional(),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  in_person_appointments: z.boolean().optional(),
  max_appointment_time: z.string().min(1, "Appointment time is required"),
});

// Validation schema
export const CalenderNameSchema = z.object({
  calenderName: z.string().min(1, "Calender name is required"),
});
// Type declaration for schema
export type CalenderNameSchemaType = z.infer<typeof CalenderNameSchema>;

// Type declaration for schema
export type CompanyDetailsSchemaType = z.infer<typeof CompanyDetailsSchema>;

export const ExistingAppointmentSchema = z.object({
  email: z.string().email("Invalid email address"),
  // phone: z.string().min(1, "Phone number is required"),
  appointment_location: z.string().min(1, "Appointment location is required"),
});

export type ExistingAppointmentSchemaType = z.infer<
  typeof ExistingAppointmentSchema
>;

export const StepFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [companyId, setCompanyId] = useState<number | null>(null);
  const [companyNumber, setCompanyNumber] = useState<string>("");
  const [userFormDetails, setUserFormDetails] = useState<IUserDetails>({
    reasonForUsing: "",
    reasonForUsingStep: "",
    calendarName: "",
    collaborators: [],
    companyDetails: {
      company_name: "",
      address_line_one: "",
      address_line_two: "",
      city: "",
      country: "",
      in_person_appointments: false,
      max_appointment_time: null!,
    },

    handleBookings: null,
  });
  const { user, loading, userDetails } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (userDetails?.onboardingStatus === EnOnboardingStatus.STATUS_1) {
        setCurrentStep(5);
      }
    }
  }, [user, loading, userDetails?.onboardingStatus]);

  // Navigate to the next step
  const goToNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  // Navigate to the next step
  const skipNextStep = () => {
    setCurrentStep((prev) => prev + 2);
  };

  // Navigate to the previous step
  const goToPreviousStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // Update user details
  const updateUserDetails = (updates: Partial<IUserDetails>) => {
    setUserFormDetails((prev) => ({ ...prev, ...updates }));
  };

  // Reset the form to its initial state
  const resetForm = () => {
    setCurrentStep(0);
    setUserFormDetails({
      reasonForUsing: "",
      reasonForUsingStep: "",
      calendarName: "",
      collaborators: [],
      companyDetails: {
        company_name: "",
        address_line_one: "",
        address_line_two: "",
        city: "",
        country: "",
        in_person_appointments: false,
        max_appointment_time: null!,
      },
      handleBookings: null,
    });
  };

  return (
    <StepFormContext.Provider
      value={{
        currentStep,
        userDetails: userFormDetails,
        goToNextStep,
        skipNextStep,
        goToPreviousStep,
        updateUserDetails,
        resetForm,
        setCompanyId,
        companyId,
        companyNumber,
        setCompanyNumber,
      }}
    >
      {children}
    </StepFormContext.Provider>
  );
  // Rest of the context implementation remains unchanged
};

// Custom hook to use the context
export const useStepForm = (): IStepFormContextType => {
  const context = useContext(StepFormContext);
  if (!context) {
    throw new Error("useStepForm must be used within a StepFormProvider");
  }
  return context;
};
