
import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useForm } from "@/context/FormContext";

interface FormStepperProps {
  currentStep: number;
}

const FormStepper: React.FC<FormStepperProps> = ({ currentStep }) => {
  const { state, dispatch } = useForm();
  
  // Define form steps - updated to match the new flow
  const steps = [
    { id: 1, label: "Traveller Details" },
    { id: 2, label: "Trip Summary" },
    { id: 3, label: "Accommodation" },
    { id: 4, label: "Transport" },
    { id: 5, label: "Meals" },
    { id: 6, label: "Allowance Review" },
    { id: 7, label: "Payment Details" },
    { id: 8, label: "Summary & Declaration" },
  ];
  
  // Navigate to specific step when clicking on the step indicator
  const handleStepClick = (stepIndex: number) => {
    // Only allow navigation to steps that have been visited or are next
    if (stepIndex <= currentStep) {
      dispatch({ type: "GO_TO_STEP", step: stepIndex });
    }
  };
  
  return (
    <nav aria-label="Form Steps" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 md:gap-4 text-sm text-muted-foreground">
        {steps.map((step, index) => {
          const isActive = step.id === currentStep;
          const isComplete = step.id < currentStep;
          
          return (
            <li key={step.id} className="flex items-center">
              {index > 0 && (
                <div className="hidden md:block mx-2 h-px w-8 bg-muted-foreground/30" />
              )}
              
              <div className="flex flex-col md:flex-row items-center">
                <button
                  type="button"
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-medium transition-colors",
                    isActive && "border-primary bg-primary text-primary-foreground",
                    isComplete && "border-primary bg-primary/10 text-primary",
                    !isActive && !isComplete && "border-muted-foreground/30"
                  )}
                  onClick={() => handleStepClick(step.id)}
                  disabled={step.id > currentStep}
                >
                  {isComplete ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </button>
                <span
                  className={cn(
                    "ml-2 text-xs font-medium hidden md:block",
                    isActive && "text-foreground font-medium",
                    isComplete && "text-primary"
                  )}
                >
                  {step.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
      
      <div className="md:hidden mt-2">
        <h2 className="text-base font-medium text-foreground">
          Step {currentStep}: {steps.find(s => s.id === currentStep)?.label}
        </h2>
      </div>
    </nav>
  );
};

export default FormStepper;
