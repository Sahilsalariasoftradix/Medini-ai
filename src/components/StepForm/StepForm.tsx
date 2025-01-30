import React from "react";
import ReasonForUsing from "./Components/StepReasonForUsing";
import NameYourCalendar from "./Components/StepNameCalendar";
import InviteCollaborators from "./Components/StepInviteCollaborators";
import CompanyDetails from "./Components/StepCompanyDetails";
import { useStepForm } from "../../store/StepFormContext";
import HandleBookings from "./Components/StepHandleBookings";
import YourNewPhone from "./Components/StepYourNewPhone";
import ProceedCallCenter from "./Components/StepProceedCallCenter";
import ProceedAvailability from "./Components/StepProceedAvailability";

const StepForm: React.FC = () => {
  const { currentStep } = useStepForm();

  const steps = [
    <ReasonForUsing />,
    <NameYourCalendar />,
    <InviteCollaborators />,
    <CompanyDetails />,
    <HandleBookings />,
    <YourNewPhone />,
    <ProceedCallCenter />,
    <ProceedAvailability />,
  ];

  return <>{steps[currentStep]}</>;
};

export default StepForm;
