
import { FormState, TravelType, SAPCode } from "../context/FormContext";
import { differenceInDays, addDays, isBefore } from "date-fns";

/**
 * Calculates the number of consecutive business nights for a trip
 * @param departureDate Trip departure date
 * @param returnDate Trip return date
 * @param personalTravelDates Dates marked as personal travel
 * @returns Number of consecutive business nights
 */
export const calculateBusinessNights = (
  departureDate: string,
  returnDate: string,
  personalTravelDates: string[]
): number => {
  if (!departureDate || !returnDate) return 0;

  const departure = new Date(departureDate);
  const returnDay = new Date(returnDate);
  
  // Calculate total nights
  const totalNights = differenceInDays(returnDay, departure);
  
  // Subtract personal travel days
  const businessNights = totalNights - personalTravelDates.length;
  
  return Math.max(0, businessNights);
};

/**
 * Determines the travel type based on business rules
 * @param consecutiveNights Number of consecutive business nights
 * @param cumulativeDays Total cumulative days (including this trip)
 * @param isAboriginalLand Whether the trip is to aboriginal land
 * @returns The determined travel type
 */
export const determineTravelType = (
  consecutiveNights: number,
  cumulativeDays: number,
  isAboriginalLand: boolean
): TravelType => {
  // Aboriginal land takes precedence over all other classifications
  if (isAboriginalLand) {
    return "aboriginal_land";
  }

  // If ≥ 365 days → Reportable LAFHA
  if (consecutiveNights >= 365) {
    return "reportable_lafha";
  } 
  // If ≥ 21 nights OR ≥ 90 cumulative days → LAFHA
  else if (consecutiveNights >= 21 || cumulativeDays >= 90) {
    return "long_stay";
  } 
  // If < 21 consecutive nights AND < 90 cumulative days → Travel Allowance
  else {
    return "short_stay";
  }
};

/**
 * Calculates if the traveler is eligible for meals allowance
 * @param departureDate Departure date
 * @param departureTime Departure time
 * @param returnDate Return date
 * @param returnTime Return time
 * @param workLocation Work location
 * @returns Boolean indicating if eligible for meals
 */
export const isMealsEligible = (
  departureDate: string,
  departureTime: string,
  returnDate: string,
  returnTime: string,
  workLocation: string
): boolean => {
  if (!departureDate || !departureTime || !returnDate || !returnTime) return false;
  
  // Extract location for distance check (simplified)
  const isDistantLocation = !workLocation.includes("office") && !workLocation.includes("headquarters");
  
  // Check if trip duration is greater than 10 hours
  const departureDateTime = new Date(`${departureDate}T${departureTime}`);
  const returnDateTime = new Date(`${returnDate}T${returnTime}`);
  const tripHours = (returnDateTime.getTime() - departureDateTime.getTime()) / (1000 * 60 * 60);
  
  // Eligible if trip is >10 hours and >50km traveled (simplified with isDistantLocation)
  return tripHours > 10 && isDistantLocation;
};

/**
 * Calculates if breakfast is eligible based on early departure
 * @param departureTime Departure time
 * @returns Boolean indicating if breakfast is eligible
 */
export const isBreakfastEligible = (departureTime: string): boolean => {
  if (!departureTime) return false;
  
  // Assuming usual start time is 9:00 AM
  const usualStartTime = new Date();
  usualStartTime.setHours(9, 0, 0, 0);
  
  // Parse departure time
  const [hours, minutes] = departureTime.split(':').map(Number);
  const departureDateTime = new Date();
  departureDateTime.setHours(hours, minutes, 0, 0);
  
  // Breakfast eligible if departure is ≥ 2 hrs before usual start time
  const twoHoursBeforeStart = new Date(usualStartTime);
  twoHoursBeforeStart.setHours(usualStartTime.getHours() - 2);
  
  return departureDateTime <= twoHoursBeforeStart;
};

/**
 * Calculates accommodation rate based on travel type, accommodation type, and conditions
 * @param travelType Travel type classification
 * @param isRemote Is remote location
 * @param isSubstandard Is substandard accommodation
 * @param isShortNotice Is short notice booking
 * @param accommodationType Type of accommodation
 * @param isApproved Is accommodation approved (for self-booked)
 * @returns The calculated accommodation rate
 */
export const calculateAccommodationRate = (
  travelType: TravelType,
  isRemote: boolean,
  isSubstandard: boolean,
  isShortNotice: boolean,
  accommodationType: string,
  isApproved: boolean
): number => {
  // Aboriginal Land has a fixed rate regardless of other factors
  if (travelType === "aboriginal_land") {
    return 280.00; // Fixed rate for Aboriginal Land
  }
  
  // Base rates by travel type and accommodation type
  let baseRate = 0;
  
  if (accommodationType === "ctm") {
    // Standard CTM rates
    switch (travelType) {
      case "short_stay":
        baseRate = 148.70;
        break;
      case "long_stay":
        baseRate = 268.34;
        break;
      case "reportable_lafha":
        baseRate = 289.70;
        break;
    }
  } else if (accommodationType === "private") {
    // Private accommodation (friends/family) rates
    baseRate = 95.00;
  } else if (accommodationType === "self_booked") {
    // Self-booked rates
    if (isApproved) {
      if (travelType === "short_stay") {
        baseRate = 159.50;
      } else {
        baseRate = 285.00;
      }
    } else {
      switch (travelType) {
        case "short_stay":
          baseRate = 148.70;
          break;
        case "long_stay":
          baseRate = 268.34;
          break;
        case "reportable_lafha":
          baseRate = 289.70;
          break;
      }
    }
  }
  
  // Apply uplifts (these are stackable)
  let rate = baseRate;
  if (isRemote) rate *= 1.2;
  if (isSubstandard) rate *= 1.15;
  
  // Short notice uplift is calculated separately at the total level
  // to accommodate the first-night-only rule
  
  return Math.round(rate * 100) / 100; // Round to 2 decimal places
};

/**
 * Calculates the meal allowance based on provided criteria
 * @param eligibleForMeals Overall eligibility for meals
 * @param businessDays Number of business days
 * @param providedMeals Array of provided meal types
 * @param breakfastEligible Is breakfast eligible due to early departure
 * @returns The calculated meal allowance amount
 */
export const calculateMealAllowance = (
  eligibleForMeals: boolean,
  businessDays: number,
  providedMeals: string[],
  breakfastEligible: boolean,
  isAboriginalLand: boolean
): number => {
  // Aboriginal Land allowance includes meals
  if (isAboriginalLand) return 0;
  
  if (!eligibleForMeals) return 0;
  
  // Base daily meal rate
  const dailyMealRate = 75;
  
  // Calculate deductions for provided meals
  const mealValueBreakdown = {
    breakfast: 25,
    lunch: 25,
    dinner: 25
  };
  
  let deductions = 0;
  providedMeals.forEach(meal => {
    if (meal === "breakfast" && !breakfastEligible) return; // Skip if breakfast not eligible
    deductions += mealValueBreakdown[meal as keyof typeof mealValueBreakdown];
  });
  
  // Calculate total meal allowance
  const totalMealAllowance = businessDays * dailyMealRate - (deductions * businessDays);
  
  return Math.max(0, totalMealAllowance);
};

/**
 * Calculates the private vehicle allowance
 * @param usePrivateVehicle Is private vehicle being used
 * @param estimatedKm Estimated kilometers
 * @param departingFromApprovedLocation Is departing from an approved location
 * @returns The calculated vehicle allowance amount
 */
export const calculateVehicleAllowance = (
  usePrivateVehicle: boolean,
  estimatedKm: number,
  departingFromApprovedLocation: boolean
): number => {
  if (!usePrivateVehicle || !departingFromApprovedLocation) return 0;
  
  // Calculate based on km rate
  const kmRate = 0.96; // $0.96 per kilometer as per EA 7.4.1
  return estimatedKm * kmRate;
};

/**
 * Determines the applicable SAP codes based on travel details
 * @param formState The current form state
 * @returns Array of applicable SAP codes
 */
export const determineSAPCodes = (formState: FormState): SAPCode[] => {
  const codes: SAPCode[] = [];
  
  // Aboriginal land codes take precedence
  if (formState.isAboriginalLand) {
    codes.push("OR12", "OR13"); // Aboriginal Lands codes
    return codes;
  }
  
  // Base allowance code based on travel type
  switch (formState.travelType) {
    case "short_stay":
      codes.push("OR03"); // Standard Travel Allowance
      break;
    case "long_stay":
      codes.push("OR23"); // LAFHA Standard
      break;
    case "reportable_lafha":
      codes.push("OR24"); // Reportable LAFHA
      break;
  }
  
  // Meal codes
  if (formState.eligibleForMeals && formState.calculatedAllowances.meals > 0) {
    codes.push("0A53"); // Standard meals allowance
    
    // Additional meal supplements
    if (formState.breakfastEligible) {
      codes.push("0A50"); // Breakfast supplement
    }
    
    // Special meal conditions
    if (formState.isRemote) {
      codes.push("0A57"); // Remote area meal supplement
    }
  }
  
  // Vehicle allowance code
  if (formState.privateVehicle.calculatedAllowance > 0) {
    codes.push("0R04"); // Vehicle allowance
  }
  
  return codes;
};

/**
 * Determines if receipts are required based on business rules
 * @param accommodationType Type of accommodation
 * @param totalAllowance Total allowance amount
 * @returns Boolean indicating if receipts are required
 */
export const isReceiptRequired = (
  accommodationType: string,
  totalAllowance: number
): boolean => {
  // Self-booked accommodation always requires receipts
  if (accommodationType === "self_booked") return true;
  
  // High value claims require receipts (ATO threshold simplified to $300)
  if (totalAllowance > 300) return true;
  
  return false;
};

/**
 * Comprehensive function to recalculate all allowances and classifications
 * @param formState The current form state
 * @returns Updated form state with calculated values
 */
export const recalculateAllowances = (formState: FormState): FormState => {
  // Create a copy of the form state to update
  const updatedState = { ...formState };
  
  // Calculate business nights (excluding personal travel days)
  updatedState.consecutiveNights = calculateBusinessNights(
    formState.departureDate,
    formState.returnDate,
    formState.personalTravelDates
  );
  
  // Determine travel type (with Aboriginal Land override)
  updatedState.travelType = determineTravelType(
    updatedState.consecutiveNights,
    updatedState.cumulativeDays + updatedState.consecutiveNights,
    formState.isAboriginalLand
  );
  
  // Calculate accommodation nights (same as business nights if accommodation required)
  if (formState.accommodationRequired) {
    updatedState.accommodationNights = updatedState.consecutiveNights;
  }
  
  // Calculate accommodation rate (with Aboriginal Land override)
  updatedState.accommodationRate = calculateAccommodationRate(
    updatedState.travelType,
    formState.accommodationType,
    formState.isRemote,
    formState.isSubstandard,
    formState.isShortNotice,
    formState.accommodationApproved
  );
  
  // Check meals eligibility
  updatedState.eligibleForMeals = isMealsEligible(
    formState.departureDate,
    formState.departureTime,
    formState.returnDate,
    formState.returnTime,
    formState.workLocation
  );
  
  // Check breakfast eligibility
  updatedState.breakfastEligible = isBreakfastEligible(formState.departureTime);
  
  // Calculate private vehicle allowance
  if (formState.privateVehicle.usePrivateVehicle) {
    updatedState.privateVehicle.calculatedAllowance = calculateVehicleAllowance(
      formState.privateVehicle.usePrivateVehicle,
      formState.privateVehicle.estimatedKm,
      formState.privateVehicle.departingFromApprovedLocation
    );
  }
  
  // Calculate accommodation total
  let accommodationTotal = 0;
  if (formState.isAboriginalLand) {
    // Fixed rate for Aboriginal Land ($280 per day)
    accommodationTotal = 280 * (updatedState.consecutiveNights + 1);
  } else if (formState.accommodationRequired) {
    // Short notice is only applied for the first night
    if (formState.isShortNotice && formState.shortNoticeFirstNightOnly && updatedState.accommodationNights > 0) {
      // First night with 10% uplift
      const firstNightRate = updatedState.accommodationRate * 1.1;
      
      // Remaining nights at standard rate
      const remainingNights = updatedState.accommodationNights - 1;
      const remainingNightsTotal = remainingNights > 0 ? remainingNights * updatedState.accommodationRate : 0;
      
      accommodationTotal = firstNightRate + remainingNightsTotal;
    } else if (formState.isShortNotice && !formState.shortNoticeFirstNightOnly) {
      // Apply short notice uplift to all nights
      accommodationTotal = updatedState.accommodationNights * (updatedState.accommodationRate * 1.1);
    } else {
      // Standard calculation with no short notice
      accommodationTotal = updatedState.accommodationNights * updatedState.accommodationRate;
    }
  }
  
  // Calculate meals allowance
  const mealsAllowance = calculateMealAllowance(
    updatedState.eligibleForMeals,
    updatedState.consecutiveNights + 1, // Days = nights + 1
    formState.providedMeals,
    updatedState.breakfastEligible,
    formState.isAboriginalLand
  );
  
  // Calculate vehicle allowance
  const vehicleTotal = updatedState.privateVehicle.calculatedAllowance;
  
  // Calculate uplifts (simplified)
  const upliftsTotal = 0;
  
  // Determine applicable SAP codes
  const sapCodes = determineSAPCodes(updatedState);
  
  // Calculate total allowance
  const totalAllowance = accommodationTotal + mealsAllowance + vehicleTotal + upliftsTotal;
  
  // Check if receipts are required
  updatedState.receiptRequired = isReceiptRequired(
    formState.accommodationType,
    totalAllowance
  );
  
  // Update calculated allowances in state
  updatedState.calculatedAllowances = {
    travelType: updatedState.travelType,
    sapCodes,
    totalNights: updatedState.accommodationNights,
    totalDays: updatedState.accommodationNights + 1,
    fbtApplicable: updatedState.travelType !== "short_stay" && !formState.isAboriginalLand,
    accommodation: accommodationTotal,
    meals: mealsAllowance,
    vehicle: vehicleTotal,
    uplifts: upliftsTotal,
    total: totalAllowance
  };
  
  return updatedState;
};
