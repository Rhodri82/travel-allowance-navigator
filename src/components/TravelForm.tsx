
import React from "react";
import { FormProvider, useForm } from "@/context/FormContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import TravelerSetup from "./form-sections/TravelerSetup";
import TripSummary from "./form-sections/TripSummary";
import AccommodationRequirements from "./form-sections/AccommodationRequirements";
import TransportOptions from "./form-sections/TransportOptions";
import MealsSection from "./form-sections/MealsSection";
import AllowanceCalculation from "./form-sections/AllowanceCalculation";
import PaymentOptions from "./form-sections/PaymentOptions";
import ApprovalSubmission from "./form-sections/ApprovalSubmission";
import FormNavigation from "./FormNavigation";
import FormStepper from "./FormStepper";
import { validateForm } from "@/utils/formValidation";
import { recalculateAllowances } from "@/utils/calculationUtils";

const FormContent = () => {
  const { state, dispatch } = useForm();
  
  // Handle next step button click
  const handleNextStep = () => {
    // Validate current section
    const errors = validateForm(state, state.currentStep);
    
    if (Object.keys(errors).length > 0) {
      // Set errors and prevent going to next step
      dispatch({ type: "SET_ERRORS", errors });
      return;
    }
    
    // Recalculate allowances before proceeding to next step
    // This ensures calculations are up-to-date when viewing the AllowanceCalculation section
    if (state.currentStep >= 2 && state.currentStep <= 5) {
      const updatedState = recalculateAllowances(state);
      
      // Update calculated fields in the form state
      Object.entries(updatedState).forEach(([key, value]) => {
        if (key !== "errors" && key !== "currentStep") {
          dispatch({ type: "UPDATE_FIELD", field: key, value });
        }
      });
    }
    
    // Proceed to next step
    dispatch({ type: "NEXT_STEP" });
  };
  
  // Handle previous step button click
  const handlePrevStep = () => {
    dispatch({ type: "PREV_STEP" });
  };
  
  // Handle form submission
  const handleSubmit = async () => {
    // Validate entire form before submission
    const errors = validateForm(state);
    
    if (Object.keys(errors).length > 0) {
      dispatch({ type: "SET_ERRORS", errors });
      return;
    }
    
    // Final recalculation before submission
    const finalState = recalculateAllowances(state);
    Object.entries(finalState).forEach(([key, value]) => {
      if (key !== "errors" && key !== "currentStep") {
        dispatch({ type: "UPDATE_FIELD", field: key, value });
      }
    });
    
    // Submit form
    dispatch({ type: "SUBMIT_FORM" });
    
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", state);
    
    // For demo purposes, show an alert
    alert("Form submitted successfully!");
  };
  
  // Render appropriate section based on current step
  const renderCurrentSection = () => {
    switch (state.currentStep) {
      case 1:
        return <TravelerSetup />;
      case 2:
        return <TripSummary />;
      case 3:
        return <AccommodationRequirements />;
      case 4:
        return <TransportOptions />;
      case 5:
        return <MealsSection />;
      case 6:
        return <AllowanceCalculation />;
      case 7:
        return <PaymentOptions />;
      case 8:
        return <ApprovalSubmission />;
      default:
        return <div>Invalid step</div>;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-6">
          <div className="flex items-center justify-between bg-primary p-4 rounded-t-lg">
            <h1 className="text-2xl font-bold text-primary-foreground">
              Travel & LAFHA Request Form
            </h1>
            <span className="text-sm text-primary-foreground opacity-75">
              v1.0 - April 2025
            </span>
          </div>
          <div className="p-6">
            <FormStepper currentStep={state.currentStep} />
            
            <div className="my-8">
              {renderCurrentSection()}
            </div>
            
            <FormNavigation 
              currentStep={state.currentStep} 
              totalSteps={8}
              onNext={handleNextStep}
              onPrev={handlePrevStep}
              onSubmit={handleSubmit}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

const TravelForm = () => {
  return (
    <FormProvider>
      <FormContent />
    </FormProvider>
  );
};

export default TravelForm;
