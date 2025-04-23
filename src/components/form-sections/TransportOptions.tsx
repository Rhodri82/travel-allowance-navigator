
import React from "react";
import { useForm } from "@/context/FormContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { CalendarIcon, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TransportOption } from "@/context/FormContext";

const TransportOptions = () => {
  const { state, dispatch } = useForm();

  // Handle transport option selection
  const handleTransportOptionChange = (
    checked: boolean,
    option: TransportOption
  ) => {
    if (checked) {
      dispatch({
        type: "UPDATE_FIELD",
        field: "selectedTransportOptions",
        value: [...state.selectedTransportOptions, option],
      });
    } else {
      dispatch({
        type: "UPDATE_FIELD",
        field: "selectedTransportOptions",
        value: state.selectedTransportOptions.filter((item) => item !== option),
      });
    }
  };

  // Handle input change for flight details
  const handleFlightInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: string
  ) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "flights",
      value: {
        ...state.flights,
        [field]: e.target.value,
      },
    });
  };

  // Handle date change for flights
  const handleFlightDateChange = (date: Date | undefined, field: string) => {
    if (date) {
      dispatch({
        type: "UPDATE_FIELD",
        field: "flights",
        value: {
          ...state.flights,
          [field]: format(date, "yyyy-MM-dd"),
        },
      });
    }
  };

  // Handle input change for car hire
  const handleCarHireInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "carHire",
      value: {
        ...state.carHire,
        [field]: e.target.value,
      },
    });
  };

  // Handle date change for car hire
  const handleCarHireDateChange = (date: Date | undefined, field: string) => {
    if (date) {
      dispatch({
        type: "UPDATE_FIELD",
        field: "carHire",
        value: {
          ...state.carHire,
          [field]: format(date, "yyyy-MM-dd"),
        },
      });
    }
  };

  // Handle input change for ferry
  const handleFerryInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "ferry",
      value: {
        ...state.ferry,
        [field]: e.target.value,
      },
    });
  };

  // Handle date change for ferry
  const handleFerryDateChange = (date: Date | undefined) => {
    if (date) {
      dispatch({
        type: "UPDATE_FIELD",
        field: "ferry",
        value: {
          ...state.ferry,
          departureDate: format(date, "yyyy-MM-dd"),
        },
      });
    }
  };

  // Handle toggle for vehicle on board ferry
  const handleVehicleOnBoardChange = (checked: boolean) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "ferry",
      value: {
        ...state.ferry,
        vehicleOnBoard: checked,
      },
    });
  };

  // Handle input change for private vehicle
  const handlePrivateVehicleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value =
      field === "estimatedKm" ? Number(e.target.value) : e.target.value;

    dispatch({
      type: "UPDATE_FIELD",
      field: "privateVehicle",
      value: {
        ...state.privateVehicle,
        [field]: value,
      },
    });

    // Auto-calculate allowance if km changes
    if (field === "estimatedKm") {
      const kmValue = Number(e.target.value);
      const calculatedAllowance = kmValue * 0.96; // $0.96 per km

      dispatch({
        type: "UPDATE_FIELD",
        field: "privateVehicle",
        value: {
          ...state.privateVehicle,
          estimatedKm: kmValue,
          calculatedAllowance,
        },
      });
    }
  };

  // Handle approved location checkbox
  const handleApprovedLocationChange = (checked: boolean) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "privateVehicle",
      value: {
        ...state.privateVehicle,
        departingFromApprovedLocation: checked,
      },
    });
  };

  // Determine if field has error
  const hasError = (field: string) => {
    return Boolean(state.errors[field]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Transport Options</h2>
        <p className="text-gray-500">
          Select and configure your required transport options for this trip.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="transport-flights"
              checked={state.selectedTransportOptions.includes("flights")}
              onCheckedChange={(checked) =>
                handleTransportOptionChange(checked as boolean, "flights")
              }
            />
            <div>
              <Label htmlFor="transport-flights">Flights</Label>
              <p className="text-sm text-muted-foreground">
                Domestic or international flights
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="transport-car-hire"
              checked={state.selectedTransportOptions.includes("car_hire")}
              onCheckedChange={(checked) =>
                handleTransportOptionChange(checked as boolean, "car_hire")
              }
            />
            <div>
              <Label htmlFor="transport-car-hire">Car Hire</Label>
              <p className="text-sm text-muted-foreground">
                Rental vehicle at destination
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="transport-ferry"
              checked={state.selectedTransportOptions.includes("ferry")}
              onCheckedChange={(checked) =>
                handleTransportOptionChange(checked as boolean, "ferry")
              }
            />
            <div>
              <Label htmlFor="transport-ferry">Ferry</Label>
              <p className="text-sm text-muted-foreground">
                Ferry or boat transport
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="transport-private-vehicle"
              checked={state.selectedTransportOptions.includes("private_vehicle")}
              onCheckedChange={(checked) =>
                handleTransportOptionChange(checked as boolean, "private_vehicle")
              }
            />
            <div>
              <Label htmlFor="transport-private-vehicle">Private Vehicle</Label>
              <p className="text-sm text-muted-foreground">
                Use of personal vehicle
              </p>
            </div>
          </div>
        </div>

        {state.selectedTransportOptions.length === 0 && hasError("transportOptions") && (
          <p className="text-destructive text-sm">
            {state.errors.transportOptions}
          </p>
        )}

        <Accordion
          type="multiple"
          defaultValue={state.selectedTransportOptions}
          className="mt-6"
        >
          {/* Flights Section */}
          {state.selectedTransportOptions.includes("flights") && (
            <AccordionItem value="flights" className="border rounded-md px-4 mb-4">
              <AccordionTrigger className="text-base font-medium py-4">
                Flight Details
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label 
                        htmlFor="flight-from"
                        className={hasError("flights-from") ? "text-destructive" : ""}
                      >
                        From
                      </Label>
                      <Input
                        id="flight-from"
                        placeholder="Departure airport/city"
                        value={state.flights.from}
                        onChange={(e) => handleFlightInputChange(e, "from")}
                        className={hasError("flights-from") ? "border-destructive" : ""}
                      />
                      {hasError("flights-from") && (
                        <p className="text-destructive text-sm">
                          {state.errors["flights-from"]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label 
                        htmlFor="flight-to"
                        className={hasError("flights-to") ? "text-destructive" : ""}
                      >
                        To
                      </Label>
                      <Input
                        id="flight-to"
                        placeholder="Arrival airport/city"
                        value={state.flights.to}
                        onChange={(e) => handleFlightInputChange(e, "to")}
                        className={hasError("flights-to") ? "border-destructive" : ""}
                      />
                      {hasError("flights-to") && (
                        <p className="text-destructive text-sm">
                          {state.errors["flights-to"]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label 
                        htmlFor="flight-departure-date"
                        className={hasError("flights-departure-date") ? "text-destructive" : ""}
                      >
                        Departure Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="flight-departure-date"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !state.flights.departureDate && "text-muted-foreground",
                              hasError("flights-departure-date") && "border-destructive"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {state.flights.departureDate
                              ? format(new Date(state.flights.departureDate), "PPP")
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={
                              state.flights.departureDate
                                ? new Date(state.flights.departureDate)
                                : undefined
                            }
                            onSelect={(date) =>
                              handleFlightDateChange(date, "departureDate")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {hasError("flights-departure-date") && (
                        <p className="text-destructive text-sm">
                          {state.errors["flights-departure-date"]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="flight-departure-time">Departure Time</Label>
                      <Input
                        id="flight-departure-time"
                        type="time"
                        value={state.flights.departureTime}
                        onChange={(e) => handleFlightInputChange(e, "departureTime")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label 
                        htmlFor="flight-return-date"
                        className={hasError("flights-return-date") ? "text-destructive" : ""}
                      >
                        Return Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="flight-return-date"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !state.flights.returnDate && "text-muted-foreground",
                              hasError("flights-return-date") && "border-destructive"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {state.flights.returnDate
                              ? format(new Date(state.flights.returnDate), "PPP")
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={
                              state.flights.returnDate
                                ? new Date(state.flights.returnDate)
                                : undefined
                            }
                            onSelect={(date) =>
                              handleFlightDateChange(date, "returnDate")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {hasError("flights-return-date") && (
                        <p className="text-destructive text-sm">
                          {state.errors["flights-return-date"]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="flight-return-time">Return Time</Label>
                      <Input
                        id="flight-return-time"
                        type="time"
                        value={state.flights.returnTime}
                        onChange={(e) => handleFlightInputChange(e, "returnTime")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="frequent-flyer">Frequent Flyer Number</Label>
                      <Input
                        id="frequent-flyer"
                        placeholder="Optional"
                        value={state.flights.frequentFlyerNumber}
                        onChange={(e) =>
                          handleFlightInputChange(e, "frequentFlyerNumber")
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="seat-preferences">Seat Preferences</Label>
                      <Input
                        id="seat-preferences"
                        placeholder="e.g., Window, Aisle"
                        value={state.flights.seatPreferences}
                        onChange={(e) =>
                          handleFlightInputChange(e, "seatPreferences")
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meal-options">Meal Options/Dietary Requirements</Label>
                    <Input
                      id="meal-options"
                      placeholder="e.g., Vegetarian, Gluten-free"
                      value={state.flights.mealOptions}
                      onChange={(e) => handleFlightInputChange(e, "mealOptions")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="flight-notes">Additional Notes</Label>
                    <Input
                      id="flight-notes"
                      placeholder="Any special requirements or information"
                      value={state.flights.notes}
                      onChange={(e) => handleFlightInputChange(e, "notes")}
                    />
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Car Hire Section */}
          {state.selectedTransportOptions.includes("car_hire") && (
            <AccordionItem value="car_hire" className="border rounded-md px-4 mb-4">
              <AccordionTrigger className="text-base font-medium py-4">
                Car Hire Details
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label 
                        htmlFor="car-pickup-location"
                        className={hasError("car-pickup-location") ? "text-destructive" : ""}
                      >
                        Pickup Location
                      </Label>
                      <Input
                        id="car-pickup-location"
                        placeholder="Airport, city, or specific address"
                        value={state.carHire.pickupLocation}
                        onChange={(e) =>
                          handleCarHireInputChange(e, "pickupLocation")
                        }
                        className={hasError("car-pickup-location") ? "border-destructive" : ""}
                      />
                      {hasError("car-pickup-location") && (
                        <p className="text-destructive text-sm">
                          {state.errors["car-pickup-location"]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label 
                        htmlFor="car-dropoff-location"
                        className={hasError("car-dropoff-location") ? "text-destructive" : ""}
                      >
                        Dropoff Location
                      </Label>
                      <Input
                        id="car-dropoff-location"
                        placeholder="Same as pickup if returning to same location"
                        value={state.carHire.dropoffLocation}
                        onChange={(e) =>
                          handleCarHireInputChange(e, "dropoffLocation")
                        }
                        className={hasError("car-dropoff-location") ? "border-destructive" : ""}
                      />
                      {hasError("car-dropoff-location") && (
                        <p className="text-destructive text-sm">
                          {state.errors["car-dropoff-location"]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label 
                        htmlFor="car-pickup-date"
                        className={hasError("car-pickup-date") ? "text-destructive" : ""}
                      >
                        Pickup Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="car-pickup-date"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !state.carHire.pickupDate && "text-muted-foreground",
                              hasError("car-pickup-date") && "border-destructive"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {state.carHire.pickupDate
                              ? format(new Date(state.carHire.pickupDate), "PPP")
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={
                              state.carHire.pickupDate
                                ? new Date(state.carHire.pickupDate)
                                : undefined
                            }
                            onSelect={(date) =>
                              handleCarHireDateChange(date, "pickupDate")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {hasError("car-pickup-date") && (
                        <p className="text-destructive text-sm">
                          {state.errors["car-pickup-date"]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="car-pickup-time">Pickup Time</Label>
                      <Input
                        id="car-pickup-time"
                        type="time"
                        value={state.carHire.pickupTime}
                        onChange={(e) =>
                          handleCarHireInputChange(e, "pickupTime")
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label 
                        htmlFor="car-dropoff-date"
                        className={hasError("car-dropoff-date") ? "text-destructive" : ""}
                      >
                        Dropoff Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="car-dropoff-date"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !state.carHire.dropoffDate && "text-muted-foreground",
                              hasError("car-dropoff-date") && "border-destructive"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {state.carHire.dropoffDate
                              ? format(new Date(state.carHire.dropoffDate), "PPP")
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={
                              state.carHire.dropoffDate
                                ? new Date(state.carHire.dropoffDate)
                                : undefined
                            }
                            onSelect={(date) =>
                              handleCarHireDateChange(date, "dropoffDate")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {hasError("car-dropoff-date") && (
                        <p className="text-destructive text-sm">
                          {state.errors["car-dropoff-date"]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="car-dropoff-time">Dropoff Time</Label>
                      <Input
                        id="car-dropoff-time"
                        type="time"
                        value={state.carHire.dropoffTime}
                        onChange={(e) =>
                          handleCarHireInputChange(e, "dropoffTime")
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="vehicle-type">Vehicle Type</Label>
                    <Select
                      value={state.carHire.vehicleType}
                      onValueChange={(value) =>
                        dispatch({
                          type: "UPDATE_FIELD",
                          field: "carHire",
                          value: {
                            ...state.carHire,
                            vehicleType: value,
                          },
                        })
                      }
                    >
                      <SelectTrigger id="vehicle-type">
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="mid_size">Mid-size</SelectItem>
                        <SelectItem value="full_size">Full-size</SelectItem>
                        <SelectItem value="suv">SUV</SelectItem>
                        <SelectItem value="van">Van</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Ferry Section */}
          {state.selectedTransportOptions.includes("ferry") && (
            <AccordionItem value="ferry" className="border rounded-md px-4 mb-4">
              <AccordionTrigger className="text-base font-medium py-4">
                Ferry Details
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label 
                        htmlFor="ferry-from"
                        className={hasError("ferry-from") ? "text-destructive" : ""}
                      >
                        From
                      </Label>
                      <Input
                        id="ferry-from"
                        placeholder="Departure port"
                        value={state.ferry.from}
                        onChange={(e) => handleFerryInputChange(e, "from")}
                        className={hasError("ferry-from") ? "border-destructive" : ""}
                      />
                      {hasError("ferry-from") && (
                        <p className="text-destructive text-sm">
                          {state.errors["ferry-from"]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label 
                        htmlFor="ferry-to"
                        className={hasError("ferry-to") ? "text-destructive" : ""}
                      >
                        To
                      </Label>
                      <Input
                        id="ferry-to"
                        placeholder="Arrival port"
                        value={state.ferry.to}
                        onChange={(e) => handleFerryInputChange(e, "to")}
                        className={hasError("ferry-to") ? "border-destructive" : ""}
                      />
                      {hasError("ferry-to") && (
                        <p className="text-destructive text-sm">
                          {state.errors["ferry-to"]}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label 
                        htmlFor="ferry-departure-date"
                        className={hasError("ferry-departure-date") ? "text-destructive" : ""}
                      >
                        Departure Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="ferry-departure-date"
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !state.ferry.departureDate && "text-muted-foreground",
                              hasError("ferry-departure-date") && "border-destructive"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {state.ferry.departureDate
                              ? format(new Date(state.ferry.departureDate), "PPP")
                              : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={
                              state.ferry.departureDate
                                ? new Date(state.ferry.departureDate)
                                : undefined
                            }
                            onSelect={handleFerryDateChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {hasError("ferry-departure-date") && (
                        <p className="text-destructive text-sm">
                          {state.errors["ferry-departure-date"]}
                        </p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="ferry-departure-time">Departure Time</Label>
                      <Input
                        id="ferry-departure-time"
                        type="time"
                        value={state.ferry.departureTime}
                        onChange={(e) =>
                          handleFerryInputChange(e, "departureTime")
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="vehicle-on-board"
                      checked={state.ferry.vehicleOnBoard}
                      onCheckedChange={handleVehicleOnBoardChange}
                    />
                    <Label htmlFor="vehicle-on-board">Vehicle on board</Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {/* Private Vehicle Section */}
          {state.selectedTransportOptions.includes("private_vehicle") && (
            <AccordionItem value="private_vehicle" className="border rounded-md px-4 mb-4">
              <AccordionTrigger className="text-base font-medium py-4">
                Private Vehicle Details
              </AccordionTrigger>
              <AccordionContent className="pb-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="start-location">Start Location</Label>
                      <Input
                        id="start-location"
                        placeholder="Starting point"
                        value={state.privateVehicle.startLocation}
                        onChange={(e) =>
                          handlePrivateVehicleInputChange(e, "startLocation")
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end-location">End Location</Label>
                      <Input
                        id="end-location"
                        placeholder="Destination"
                        value={state.privateVehicle.endLocation}
                        onChange={(e) =>
                          handlePrivateVehicleInputChange(e, "endLocation")
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label 
                        htmlFor="estimated-km"
                        className={hasError("private-vehicle-km") ? "text-destructive" : ""}
                      >
                        Estimated Kilometers
                      </Label>
                      <span className="text-sm text-muted-foreground">
                        Rate: $0.96/km
                      </span>
                    </div>
                    <Input
                      id="estimated-km"
                      type="number"
                      min="0"
                      placeholder="Total km for trip"
                      value={state.privateVehicle.estimatedKm || ""}
                      onChange={(e) =>
                        handlePrivateVehicleInputChange(e, "estimatedKm")
                      }
                      className={hasError("private-vehicle-km") ? "border-destructive" : ""}
                    />
                    {hasError("private-vehicle-km") && (
                      <p className="text-destructive text-sm">
                        {state.errors["private-vehicle-km"]}
                      </p>
                    )}
                  </div>

                  <div className="bg-muted/40 p-3 rounded-md">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Calculated Allowance:
                      </span>
                      <span className="text-lg font-bold">
                        ${state.privateVehicle.calculatedAllowance.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-2 border p-3 rounded-md bg-amber-50 border-amber-100">
                    <div className="mt-1">
                      <Info className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-amber-700">
                        <strong>EA Compliance Note:</strong> Private vehicle use is only permitted if departing from a depot or approved location per EA 7.4.1.
                      </p>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="approved-location"
                          checked={state.privateVehicle.departingFromApprovedLocation}
                          onCheckedChange={handleApprovedLocationChange}
                        />
                        <Label htmlFor="approved-location">
                          I confirm this journey departs from an approved location
                        </Label>
                      </div>
                      {hasError("private-vehicle-location") && (
                        <p className="text-destructive text-sm">
                          {state.errors["private-vehicle-location"]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div>
  );
};

export default TransportOptions;
