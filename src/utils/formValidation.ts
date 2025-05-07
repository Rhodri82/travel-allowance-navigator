
import { FormState } from "../context/FormContext";

// Function to validate the entire form state or a specific section
export const validateForm = (
  formState: FormState,
  section?: number
): Record<string, string> => {
  const errors: Record<string, string> = {};

  // Only validate the requested section if specified
  if (section) {
    switch (section) {
      case 1:
        validateTravelerSection(formState, errors);
        break;
      case 2:
        validateTripSummarySection(formState, errors);
        break;
      case 4:
        validateAccommodationSection(formState, errors);
        break;
      case 5:
        validateTransportSection(formState, errors);
        break;
      case 8:
        validatePaymentSection(formState, errors);
        break;
      case 9:
        validateApprovalSection(formState, errors);
        break;
      default:
        break;
    }

    return errors;
  }

  // Otherwise validate the entire form
  validateTravelerSection(formState, errors);
  validateTripSummarySection(formState, errors);
  validateAccommodationSection(formState, errors);
  validateTransportSection(formState, errors);
  validatePaymentSection(formState, errors);
  validateApprovalSection(formState, errors);

  return errors;
};

// Section 1: Traveler Setup validation
const validateTravelerSection = (
  formState: FormState,
  errors: Record<string, string>
): void => {
  // Validate booking type is selected
  if (!formState.bookingFor) {
    errors.bookingFor = "Please select who this booking is for";
  }

  // If booking for someone else or a group, validate traveler information
  if (
    formState.bookingFor !== "myself" && 
    (formState.travelers.length === 0)
  ) {
    errors.travelers = "Please add at least one traveler";
  }

  // Validate each traveler has required fields
  formState.travelers.forEach((traveler, index) => {
    if (!traveler.name) {
      errors[`traveler-${index}-name`] = "Traveler name is required";
    }
    if (!traveler.employeeId) {
      errors[`traveler-${index}-employeeId`] = "Employee ID is required";
    }
    if (!traveler.mobileNumber) {
      errors[`traveler-${index}-mobileNumber`] = "Mobile number is required";
    }
    if (!traveler.role) {
      errors[`traveler-${index}-role`] = "Role is required";
    }
  });
};

// Section 2: Trip Summary validation
const validateTripSummarySection = (
  formState: FormState,
  errors: Record<string, string>
): void => {
  // Validate trip purpose
  if (!formState.tripPurpose) {
    errors.tripPurpose = "Trip purpose is required";
  }

  // If "other" is selected, validate the description
  if (formState.tripPurpose === "other" && !formState.tripPurposeOther) {
    errors.tripPurposeOther = "Please specify the trip purpose";
  }

  // Validate work location
  if (!formState.workLocation) {
    errors.workLocation = "Location of work is required";
  }

  // Validate work order or cost center
  if (!formState.workOrder && !formState.costCentre) {
    errors.financials = "Either work order or cost centre is required";
  }

  // Validate departure date
  if (!formState.departureDate) {
    errors.departureDate = "Departure date is required";
  }

  // Validate departure time
  if (!formState.departureTime) {
    errors.departureTime = "Departure time is required";
  }

  // Validate return date
  if (!formState.returnDate) {
    errors.returnDate = "Return date is required";
  }

  // Validate return time
  if (!formState.returnTime) {
    errors.returnTime = "Return time is required";
  }

  // Validate dates are in correct order
  if (formState.departureDate && formState.returnDate) {
    const departureDate = new Date(formState.departureDate);
    const returnDate = new Date(formState.returnDate);
    if (returnDate < departureDate) {
      errors.returnDate = "Return date cannot be before departure date";
    }
  }

  // If personal travel is selected, ensure dates are specified
  if (formState.hasPersonalTravel && formState.personalTravelDates.length === 0) {
    errors.personalTravelDates = "Please specify personal travel dates";
  }
};

// Section 4: Accommodation validation
const validateAccommodationSection = (
  formState: FormState,
  errors: Record<string, string>
): void => {
  // Only validate if accommodation is required
  if (!formState.accommodationRequired) {
    return;
  }

  // Validate accommodation type is selected
  if (!formState.accommodationType) {
    errors.accommodationType = "Please select accommodation type";
  }

  // If self-booked, validate approval
  if (formState.accommodationType === "self_booked" && !formState.accommodationApproved) {
    errors.accommodationApproved = "Self-booked accommodation requires approval";
  }

  // Validate nights count is positive
  if (formState.accommodationNights <= 0) {
    errors.accommodationNights = "Number of nights must be at least 1";
  }
};

// Section 5: Transport validation
const validateTransportSection = (
  formState: FormState,
  errors: Record<string, string>
): void => {
  // Validate at least one transport option is selected
  if (formState.selectedTransportOptions.length === 0) {
    errors.transportOptions = "Please select at least one transport option";
  }

  // Validate flights if selected
  if (formState.selectedTransportOptions.includes("flights")) {
    // Check first flight (default flight)
    const defaultFlight = formState.flights[0];
    if (!defaultFlight.from) {
      errors["flights-from"] = "Departure location is required";
    }
    if (!defaultFlight.to) {
      errors["flights-to"] = "Arrival location is required";
    }
    if (!defaultFlight.departureDate) {
      errors["flights-departure-date"] = "Flight departure date is required";
    }
    if (!defaultFlight.returnDate) {
      errors["flights-return-date"] = "Flight return date is required";
    }
  }

  // Validate car hire if selected
  if (formState.selectedTransportOptions.includes("car_hire")) {
    if (!formState.carHire.pickupLocation) {
      errors["car-pickup-location"] = "Car pickup location is required";
    }
    if (!formState.carHire.dropoffLocation) {
      errors["car-dropoff-location"] = "Car dropoff location is required";
    }
    if (!formState.carHire.pickupDate) {
      errors["car-pickup-date"] = "Car pickup date is required";
    }
    if (!formState.carHire.dropoffDate) {
      errors["car-dropoff-date"] = "Car dropoff date is required";
    }
  }

  // Validate ferry if selected
  if (formState.selectedTransportOptions.includes("ferry")) {
    if (!formState.ferry.from) {
      errors["ferry-from"] = "Ferry departure location is required";
    }
    if (!formState.ferry.to) {
      errors["ferry-to"] = "Ferry arrival location is required";
    }
    if (!formState.ferry.departureDate) {
      errors["ferry-departure-date"] = "Ferry departure date is required";
    }
  }

  // Validate private vehicle if selected
  if (formState.selectedTransportOptions.includes("private_vehicle")) {
    if (!formState.privateVehicle.estimatedKm || formState.privateVehicle.estimatedKm <= 0) {
      errors["private-vehicle-km"] = "Estimated kilometers must be greater than 0";
    }
    if (!formState.privateVehicle.departingFromApprovedLocation) {
      errors["private-vehicle-location"] = "Private vehicle must depart from an approved location per EA 7.4.1";
    }
  }
};

// Section 8: Payment validation
const validatePaymentSection = (
  formState: FormState,
  errors: Record<string, string>
): void => {
  // Validate payment method is selected
  if (!formState.paymentVia) {
    errors.paymentVia = "Please select a payment method";
  }

  // If advance payment is required, ensure payroll deduction is authorized
  if (formState.advancePaymentRequired && !formState.authorizePayrollDeduction) {
    errors.authorizePayrollDeduction = "Please authorize payroll deduction for advance payments";
  }

  // If receipts are required, ensure they are uploaded
  if (formState.receiptRequired && formState.receipts.length === 0) {
    errors.receipts = "Please upload required receipts";
  }
};

// Section 9: Approval and submission validation
const validateApprovalSection = (
  formState: FormState,
  errors: Record<string, string>
): void => {
  // Validate declaration is checked
  if (!formState.declaration) {
    errors.declaration = "Please agree to the declaration";
  }
};

// Helper function to check if a section is valid
export const isSectionValid = (
  formState: FormState,
  section: number
): boolean => {
  const errors = validateForm(formState, section);
  return Object.keys(errors).length === 0;
};
