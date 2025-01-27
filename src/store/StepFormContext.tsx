import { createContext, useContext, useState } from "react";
import { IStepFormContextType, IUserDetails } from "../types/api/Interfaces";

const StepFormContext = createContext<IStepFormContextType | undefined>(
  undefined
);

export const StepFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [userDetails, setUserDetails] = useState<IUserDetails>({
    reasonForUsing: "",
    calendarName: "",
    collaborators: [],
    companyDetails: {
      businessName: "",
      address: "",
      apartmentSuite: "",
      city: "",
      country: "",
      maxAppointmentTime: "",
    },
  });

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
  //   const resetForm = () => {
  //     setCurrentStep(0);
  //     setUserDetails({
  //       firstName: '',
  //       lastName: '',
  //       email: '',
  //       password: '',
  //     });
  //   };

  return (
    <StepFormContext.Provider
      value={{
        currentStep,
        userDetails,
        goToNextStep,
        goToPreviousStep,
        updateUserDetails,
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
