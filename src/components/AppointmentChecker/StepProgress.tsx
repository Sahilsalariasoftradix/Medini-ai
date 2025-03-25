import React from "react";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

const StepProgress: React.FC<StepProgressProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="step-progress">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`step ${index < currentStep ? "active" : "inactive"}`}
        ></div>
      ))}
    </div>
  );
};

export default StepProgress;