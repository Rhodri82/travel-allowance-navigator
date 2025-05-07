import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define traveler types
export type TravelerType = "myself" | "someone_else" | "group";

// Define meal types
export type MealType = "breakfast" | "lunch" | "dinner";

// Define travel types based on duration
export type TravelType = "short_stay" | "long_stay" | "reportable_lafha" | "aboriginal_land";

// Define accommodation types
export type AccommodationType = "ctm" | "private" | "self_booked";

// Define transport options
export type TransportOption = "flights" | "car_hire" | "ferry" | "private_vehicle";

// Define time windows for transport
export type TimeWindow = "morning" | "afternoon" | "evening";

// Define SAP codes
export type SAPCode = 
  | "OR03" // Standard Travel Allowance
  | "OR23" // LAFHA Standard
  | "OR24" // Reportable LAFHA
  | "OR12" | "OR13" // Aboriginal Lands
  | "0R04" // Other allowance
  | "0A53" // Meals
  | "0A50" // Additional meals
  | "0A57"; // Meal supplements

// Define the traveler information
export interface Traveler {
  id: string;
  name: string;
  employeeId: string;
  mobileNumber: string;
  role: string;
}

// Define flight information
export interface Flight {
  id: string;
  from: string;
  to: string;
  departureDate: string;
  departureWindow: TimeWindow;
  returnDate: string;
  returnWindow: TimeWindow;
  frequentFlyerNumber: string;
  seatPreferences: string;
  mealOptions: string;
  notes: string;
}

// Define the entire form state
export interface FormState {
  // Section 1: Traveler Setup
  bookingFor: TravelerType;
  travelers: Traveler[];
  currentUser?: Traveler;

  // Section 2: Trip Summary
  tripPurpose: "work" | "training" | "conference" | "other" | "";
  tripPurposeOther?: string;
  workLocation: string;
  isAboriginalLand: boolean;
  workOrder: string;
  costCentre: string;
  departureDate: string;
  departureTime: string;
  returnDate: string;
  returnTime: string;
  hasPersonalTravel: boolean;
  personalTravelDates: string[];

  // Section 3: Travel Duration (calculated)
  consecutiveNights: number;
  cumulativeDays: number;
  travelType: TravelType;

  // Section 4: Accommodation
  accommodationRequired: boolean;
  accommodationType: AccommodationType | "";
  accommodationApproved: boolean;
  isRemote: boolean;
  isSubstandard: boolean;
  isShortNotice: boolean;
  shortNoticeFirstNightOnly: boolean; // Default to true for the short notice first night only logic
  accommodationNights: number;
  accommodationRate: number;

  // Section 5: Transport
  selectedTransportOptions: TransportOption[];
  
  // Flights
  showFlights: boolean;
  flights: Flight[];
  
  // Car Hire
  carHire: {
    pickupLocation: string;
    dropoffLocation: string;
    pickupDate: string;
    pickupTime: string;
    dropoffDate: string;
    dropoffTime: string;
    vehicleType: string;
  };
  
  // Ferry
  ferry: {
    from: string;
    to: string;
    departureDate: string;
    departureWindow: TimeWindow;
    returnDate: string;
    returnWindow: TimeWindow;
    vehicleOnBoard: boolean;
  };
  
  // Private Vehicle
  privateVehicle: {
    usePrivateVehicle: boolean;
    estimatedKm: number;
    startLocation: string;
    endLocation: string;
    calculatedAllowance: number;
    departingFromApprovedLocation: boolean;
  };

  // Section 6: Meals
  eligibleForMeals: boolean;
  mealsProvided: boolean;
  providedMeals: MealType[];
  breakfastEligible: boolean;

  // Section 7: LAFHA & Allowance Calculation (calculated)
  calculatedAllowances: {
    travelType: TravelType;
    sapCodes: SAPCode[];
    totalNights: number;
    totalDays: number;
    fbtApplicable: boolean;
    accommodation: number;
    meals: number;
    vehicle: number;
    uplifts: number;
    total: number;
  };

  // Section 8: Payment Options
  advancePaymentRequired: boolean;
  authorizePayrollDeduction: boolean;
  paymentVia: "payroll" | "reimbursement" | "";
  receiptRequired: boolean;
  receipts: File[];

  // Section 9: Approval & Submission
  declaration: boolean;
  attachments: File[];
  submissionTimestamp: string;

  // Form Navigation
  currentStep: number;
  formValid: boolean;
  errors: Record<string, string>;
}

// Initial state for the form
const initialState: FormState = {
  // Section 1: Traveler Setup
  bookingFor: "myself",
  travelers: [],
  currentUser: undefined,

  // Section 2: Trip Summary
  tripPurpose: "",
  workLocation: "",
  isAboriginalLand: false,
  workOrder: "",
  costCentre: "",
  departureDate: "",
  departureTime: "",
  returnDate: "",
  returnTime: "",
  hasPersonalTravel: false,
  personalTravelDates: [],

  // Section 3: Travel Duration (calculated)
  consecutiveNights: 0,
  cumulativeDays: 0,
  travelType: "short_stay",

  // Section 4: Accommodation
  accommodationRequired: false,
  accommodationType: "",
  accommodationApproved: false,
  isRemote: false,
  isSubstandard: false,
  isShortNotice: false,
  shortNoticeFirstNightOnly: true, // Default to true for the short notice first night only logic
  accommodationNights: 0,
  accommodationRate: 0,

  // Section 5: Transport
  selectedTransportOptions: [],
  
  // Flights
  showFlights: false,
  flights: [{
    id: "default",
    from: "",
    to: "",
    departureDate: "",
    departureWindow: "morning",
    returnDate: "",
    returnWindow: "afternoon",
    frequentFlyerNumber: "",
    seatPreferences: "",
    mealOptions: "",
    notes: "",
  }],
  
  // Car Hire
  carHire: {
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    pickupTime: "",
    dropoffDate: "",
    dropoffTime: "",
    vehicleType: "",
  },
  
  // Ferry
  ferry: {
    from: "",
    to: "",
    departureDate: "",
    departureWindow: "morning",
    returnDate: "",
    returnWindow: "afternoon",
    vehicleOnBoard: false,
  },
  
  // Private Vehicle
  privateVehicle: {
    usePrivateVehicle: false,
    estimatedKm: 0,
    startLocation: "",
    endLocation: "",
    calculatedAllowance: 0,
    departingFromApprovedLocation: false,
  },

  // Section 6: Meals
  eligibleForMeals: false,
  mealsProvided: false,
  providedMeals: [],
  breakfastEligible: false,

  // Section 7: LAFHA & Allowance Calculation (calculated)
  calculatedAllowances: {
    travelType: "short_stay",
    sapCodes: [],
    totalNights: 0,
    totalDays: 0,
    fbtApplicable: false,
    accommodation: 0,
    meals: 0,
    vehicle: 0,
    uplifts: 0,
    total: 0,
  },

  // Section 8: Payment Options
  advancePaymentRequired: false,
  authorizePayrollDeduction: false,
  paymentVia: "",
  receiptRequired: false,
  receipts: [],

  // Section 9: Approval & Submission
  declaration: false,
  attachments: [],
  submissionTimestamp: "",

  // Form Navigation
  currentStep: 1,
  formValid: false,
  errors: {},
};

// Define action types
type ActionType = 
  | { type: "UPDATE_FIELD"; field: string; value: any }
  | { type: "ADD_TRAVELER"; traveler: Traveler }
  | { type: "REMOVE_TRAVELER"; id: string }
  | { type: "SET_CURRENT_USER"; user: Traveler }
  | { type: "ADD_PERSONAL_TRAVEL_DATE"; date: string }
  | { type: "REMOVE_PERSONAL_TRAVEL_DATE"; date: string }
  | { type: "CALCULATE_TRAVEL_DURATION" }
  | { type: "CALCULATE_ALLOWANCES" }
  | { type: "ADD_FLIGHT" }
  | { type: "REMOVE_FLIGHT"; id: string }
  | { type: "UPDATE_FLIGHT"; id: string; field: string; value: any }
  | { type: "SET_ERRORS"; errors: Record<string, string> }
  | { type: "CLEAR_ERROR"; field: string }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "GO_TO_STEP"; step: number }
  | { type: "ADD_ATTACHMENT"; file: File }
  | { type: "REMOVE_ATTACHMENT"; index: number }
  | { type: "ADD_RECEIPT"; file: File }
  | { type: "REMOVE_RECEIPT"; index: number }
  | { type: "SUBMIT_FORM" };

// Form reducer
const formReducer = (state: FormState, action: ActionType): FormState => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return {
        ...state,
        [action.field]: action.value
      };
    
    case "ADD_TRAVELER":
      return {
        ...state,
        travelers: [...state.travelers, action.traveler]
      };
    
    case "REMOVE_TRAVELER":
      return {
        ...state,
        travelers: state.travelers.filter(t => t.id !== action.id)
      };
    
    case "SET_CURRENT_USER":
      return {
        ...state,
        currentUser: action.user
      };
    
    case "ADD_PERSONAL_TRAVEL_DATE":
      return {
        ...state,
        personalTravelDates: [...state.personalTravelDates, action.date]
      };
    
    case "REMOVE_PERSONAL_TRAVEL_DATE":
      return {
        ...state,
        personalTravelDates: state.personalTravelDates.filter(d => d !== action.date)
      };
    
    case "CALCULATE_TRAVEL_DURATION": {
      // Calculate nights between departure and return
      const departureDate = new Date(state.departureDate);
      const returnDate = new Date(state.returnDate);
      
      // Calculate nights (exclude personal travel days)
      const totalNights = Math.floor((returnDate.getTime() - departureDate.getTime()) / (1000 * 3600 * 24));
      const businessNights = totalNights - state.personalTravelDates.length;
      
      // Determine travel type based on business rules
      let travelType: TravelType = "short_stay";
      
      // Aboriginal land takes precedence over all other classifications
      if (state.isAboriginalLand) {
        travelType = "aboriginal_land";
      }
      // Otherwise, use the standard duration-based rules
      else if (businessNights >= 365) {
        travelType = "reportable_lafha";
      } else if (businessNights >= 21 || state.cumulativeDays + businessNights >= 90) {
        travelType = "long_stay";
      }
      
      return {
        ...state,
        consecutiveNights: businessNights,
        travelType,
      };
    }
    
    case "ADD_FLIGHT": {
      const newFlight: Flight = {
        id: `flight-${Date.now()}`,
        from: "",
        to: "",
        departureDate: state.departureDate || "",
        departureWindow: "morning",
        returnDate: state.returnDate || "",
        returnWindow: "afternoon",
        frequentFlyerNumber: "",
        seatPreferences: "",
        mealOptions: "",
        notes: "",
      };
      
      return {
        ...state,
        flights: [...state.flights, newFlight]
      };
    }
    
    case "REMOVE_FLIGHT": {
      // Never remove the last flight
      if (state.flights.length <= 1) {
        return state;
      }
      
      return {
        ...state,
        flights: state.flights.filter(flight => flight.id !== action.id)
      };
    }
    
    case "UPDATE_FLIGHT": {
      return {
        ...state,
        flights: state.flights.map(flight => 
          flight.id === action.id 
            ? { ...flight, [action.field]: action.value } 
            : flight
        )
      };
    }
    
    case "CALCULATE_ALLOWANCES": {
      // Calculate accommodation allowance
      let accommodationRate = 0;
      let accommodationTotal = 0;
      
      if (state.accommodationRequired) {
        // Use different rates based on accommodation type
        if (state.accommodationType === "ctm") {
          // Standard CTM rates
          if (state.travelType === "short_stay") {
            accommodationRate = 148.70;
          } else if (state.travelType === "long_stay") {
            accommodationRate = 268.34;
          } else if (state.travelType === "reportable_lafha") {
            accommodationRate = 289.70;
          }
        } else if (state.accommodationType === "private") {
          // Private accommodation (friends/family) rates
          accommodationRate = 95.00; // Lower rate for private accommodation
        } else if (state.accommodationType === "self_booked") {
          // Self-booked rates
          if (state.accommodationApproved) {
            if (state.travelType === "short_stay") {
              accommodationRate = 159.50;
            } else {
              accommodationRate = 285.00;
            }
          } else {
            if (state.travelType === "short_stay") {
              accommodationRate = 148.70;
            } else if (state.travelType === "long_stay") {
              accommodationRate = 268.34;
            } else if (state.travelType === "reportable_lafha") {
              accommodationRate = 289.70;
            }
          }
        }
        
        // Apply uplifts (these are stackable)
        let baseRate = accommodationRate;
        
        if (state.isRemote) {
          accommodationRate *= 1.2; // 20% uplift for remote locations
        }
        
        if (state.isSubstandard) {
          accommodationRate *= 1.15; // 15% uplift for substandard accommodation
        }
        
        // Short notice is only applied for the first night
        if (state.isShortNotice && state.shortNoticeFirstNightOnly) {
          // Calculate regular nights at normal rate
          const regularNightsRate = (state.accommodationNights - 1) * accommodationRate;
          // Calculate first night with uplift
          const firstNightRate = baseRate * 1.1;
          // Total is combined
          accommodationTotal = regularNightsRate + firstNightRate;
        } else if (state.isShortNotice && !state.shortNoticeFirstNightOnly) {
          // Apply 10% uplift to all nights
          accommodationRate *= 1.1;
          accommodationTotal = state.accommodationNights * accommodationRate;
        } else {
          // Regular calculation for all nights
          accommodationTotal = state.accommodationNights * accommodationRate;
        }
      }
      
      // Aboriginal Land Allowance overrides other calculations
      if (state.isAboriginalLand) {
        const aboriginalLandDailyRate = 280.00; // $280/day fixed rate
        const businessDays = state.consecutiveNights + 1;
        accommodationTotal = aboriginalLandDailyRate * businessDays;
        accommodationRate = aboriginalLandDailyRate;
      }
      
      // Calculate meals allowance
      let mealsTotal = 0;
      if (state.eligibleForMeals && !state.isAboriginalLand) {
        // Base rate of $75/day for meals (simplified)
        const mealRate = 75;
        const mealsDeducted = state.providedMeals.length * (mealRate / 3);
        mealsTotal = (state.consecutiveNights + 1) * mealRate - mealsDeducted;
      } else if (state.eligibleForMeals && state.isAboriginalLand) {
        // Meals are included in the Aboriginal Land allowance
        mealsTotal = 0;
      }
      
      // Calculate vehicle allowance
      const vehicleTotal = state.privateVehicle.usePrivateVehicle 
        ? state.privateVehicle.estimatedKm * 0.96 
        : 0;
      
      // Calculate uplifts
      const upliftsTotal = 0; // Complex calculation would go here
      
      // Determine SAP codes
      const sapCodes: SAPCode[] = [];
      
      // Aboriginal land codes take precedence
      if (state.isAboriginalLand) {
        sapCodes.push("OR12", "OR13");
      } else {
        // Standard codes based on travel type
        if (state.travelType === "short_stay") {
          sapCodes.push("OR03");
        } else if (state.travelType === "long_stay") {
          sapCodes.push("OR23");
        } else if (state.travelType === "reportable_lafha") {
          sapCodes.push("OR24");
        }
        
        // Add meal codes if applicable
        if (mealsTotal > 0) {
          sapCodes.push("0A53");
          
          if (state.breakfastEligible) {
            sapCodes.push("0A50");
          }
        }
      }
      
      // Vehicle allowance code
      if (vehicleTotal > 0) {
        sapCodes.push("0R04");
      }
      
      // Receipt requirement logic
      const receiptRequired = 
        state.accommodationType === "self_booked" ||
        (accommodationTotal + mealsTotal + vehicleTotal + upliftsTotal) > 300;
      
      // FBT applicability
      const fbtApplicable = state.travelType !== "short_stay" && !state.isAboriginalLand;
      
      return {
        ...state,
        accommodationRate, // Store the base rate (without short notice adjustments)
        calculatedAllowances: {
          travelType: state.travelType,
          sapCodes,
          totalNights: state.accommodationNights,
          totalDays: state.accommodationNights + 1,
          fbtApplicable,
          accommodation: accommodationTotal,
          meals: mealsTotal,
          vehicle: vehicleTotal,
          uplifts: upliftsTotal,
          total: accommodationTotal + mealsTotal + vehicleTotal + upliftsTotal,
        },
        receiptRequired
      };
    }
    
    case "SET_ERRORS":
      return {
        ...state,
        errors: action.errors,
        formValid: Object.keys(action.errors).length === 0
      };
    
    case "CLEAR_ERROR":
      const newErrors = { ...state.errors };
      delete newErrors[action.field];
      
      return {
        ...state,
        errors: newErrors,
        formValid: Object.keys(newErrors).length === 0
      };
    
    case "NEXT_STEP":
      return {
        ...state,
        currentStep: state.currentStep + 1
      };
    
    case "PREV_STEP":
      return {
        ...state,
        currentStep: Math.max(1, state.currentStep - 1)
      };
    
    case "GO_TO_STEP":
      return {
        ...state,
        currentStep: action.step
      };
    
    case "ADD_ATTACHMENT":
      return {
        ...state,
        attachments: [...state.attachments, action.file]
      };
    
    case "REMOVE_ATTACHMENT":
      return {
        ...state,
        attachments: state.attachments.filter((_, i) => i !== action.index)
      };
    
    case "ADD_RECEIPT":
      return {
        ...state,
        receipts: [...state.receipts, action.file]
      };
    
    case "REMOVE_RECEIPT":
      return {
        ...state,
        receipts: state.receipts.filter((_, i) => i !== action.index)
      };
    
    case "SUBMIT_FORM":
      return {
        ...state,
        submissionTimestamp: new Date().toISOString()
      };
    
    default:
      return state;
  }
};

// Create context
interface FormContextType {
  state: FormState;
  dispatch: React.Dispatch<ActionType>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

// Provider component
export const FormProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(formReducer, initialState);
  
  const value = { state, dispatch };
  
  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to use the form context
export const useForm = () => {
  const context = useContext(FormContext);
  
  if (!context) {
    throw new Error("useForm must be used within a FormProvider");
  }
  
  return context;
};
