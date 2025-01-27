import React from "react";
import ReasonForUsing from "./Components/StepReasonForUsing";
import NameYourCalendar from "./Components/StepNameCalendar";
import InviteCollaborators from "./Components/StepInviteCollaborators";
import CompanyDetails from "./Components/StepCompanyDetails";
import { useStepForm } from "../../store/StepFormContext";

const StepForm: React.FC = () => {
  const { currentStep } = useStepForm();
  const steps = [
    <ReasonForUsing />,
    <NameYourCalendar />,
    <InviteCollaborators />,
    <CompanyDetails />,
  ];

  return <>{steps[currentStep]}</>;
};

export default StepForm;
