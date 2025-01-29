import { createContext, useContext, useState } from "react";
import { IStepFormContextType, IUserDetails } from "../types/api/Interfaces";
import { z } from "zod";

const StepFormContext = createContext<IStepFormContextType | undefined>(
  undefined
);
// Validation Schema
export const CompanyDetailsSchema = z.object({
  officeName: z
    .string()
    .min(8, "Office name should be at least 8 characters")
    .max(50, "Office name can be up to 50 characters"),
  apartment: z
    .string()
    .min(8, "Apartment name should be at least 8 characters")
    .max(50, "Apartment name can be up to 50 characters"),
  address: z
    .string()
    .min(8, "Address should be at least 8 characters")
    .max(50, "Address can be up to 50 characters"),
  city: z.string().min(1, "City is required"),
  country: z.string().min(1, "Country is required"),
  appointment: z.boolean().optional(),
  appointmentTime: z.string().min(1, "Appointment time is required"),
});
// Validation schema
export const CalenderNameSchema = z.object({
  calenderName: z.string().min(1, "Calender name is required"),
});
// Type declaration for schema
export type CalenderNameSchemaType = z.infer<typeof CalenderNameSchema>;

// Type declaration for schema
export type CompanyDetailsSchemaType = z.infer<typeof CompanyDetailsSchema>;

export const StepFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userDetails, setUserDetails] = useState<IUserDetails>({
    reasonForUsing: "",
    reasonForUsingStep: "",
    calendarName: "",
    collaborators: [],
    companyDetails: {
      businessName: "",
      address: "",
      apartmentSuite: "",
      city: "",
      country: "",
      appointment: false,
      maxAppointmentTime: "",
    },
  });
  // console.log("🚀 ~ userDetails:", userDetails);

  // Navigate to the next step
  const goToNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  // Navigate to the previous step
  const goToPreviousStep = () => {
    setCurrentStep((prev) => (prev > 0 ? prev - 1 : 0));
  };

  // Update user details
  const updateUserDetails = (updates: Partial<IUserDetails>) => {
    setUserDetails((prev) => ({ ...prev, ...updates }));
  };

  // Reset the form to its initial state
  const resetForm = () => {
    setCurrentStep(0);
    setUserDetails({
      reasonForUsing: "",
      reasonForUsingStep: "",
      calendarName: "",
      collaborators: [],
      companyDetails: {
        businessName: "",
        address: "",
        apartmentSuite: "",
        city: "",
        country: "",
        appointment: false,
        maxAppointmentTime: "",
      },
    });
  };

  return (
    <StepFormContext.Provider
      value={{
        currentStep,
        userDetails,
        goToNextStep,
        goToPreviousStep,
        updateUserDetails,
        resetForm
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
