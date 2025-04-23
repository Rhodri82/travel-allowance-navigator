
import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useForm } from "@/context/FormContext";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onSubmit: () => void;
}

const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onSubmit,
}) => {
  const { state } = useForm();
  const isLastStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;
  
  // Count errors in the current state
  const errorCount = Object.keys(state.errors).length;
  
  return (
    <div>
      {errorCount > 0 && (
        <div className="bg-destructive/10 p-3 rounded-md mb-4 flex items-start">
          <AlertCircle className="text-destructive mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-destructive font-medium">Please fix the following errors:</p>
            <ul className="list-disc pl-5 mt-2 text-destructive text-sm">
              {Object.values(state.errors).map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={onPrev}
          disabled={isFirstStep}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <Button
          variant="ghost"
          onClick={() => alert("Your form progress has been saved.")}
          className="flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          Save Draft
        </Button>
        
        {isLastStep ? (
          <Button 
            onClick={onSubmit}
            disabled={errorCount > 0}
            className="flex items-center gap-2"
          >
            Submit Form
          </Button>
        ) : (
          <Button 
            onClick={onNext}
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default FormNavigation;
