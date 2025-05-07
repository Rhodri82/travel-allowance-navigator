
import React from "react";
import { useForm } from "@/context/FormContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { format } from "date-fns";
import { 
  CalendarIcon, 
  Trash2, 
  Plus, 
  Airplane,
  Car, 
  Ship, 
  Briefcase,
  Clock
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { TimeWindow } from "@/context/FormContext";

const timeWindowOptions = [
  { value: "morning", label: "Morning (5am - 12pm)" },
  { value: "afternoon", label: "Afternoon (12pm - 5pm)" },
  { value: "evening", label: "Evening (5pm - 12am)" }
];

const FlightSection = () => {
  const { state, dispatch } = useForm();

  const handleFlightChange = (id: string, field: string, value: any) => {
    dispatch({
      type: "UPDATE_FLIGHT",
      id,
      field,
      value
    });
  };

  const handleAddFlight = () => {
    dispatch({ type: "ADD_FLIGHT" });
  };

  const handleRemoveFlight = (id: string) => {
    dispatch({ type: "REMOVE_FLIGHT", id });
  };
  
  const handleToggleFlights = (checked: boolean) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "showFlights",
      value: checked
    });
  };
  
  // Format time window for display
  const formatTimeWindow = (window: TimeWindow): string => {
    const option = timeWindowOptions.find(opt => opt.value === window);
    return option ? option.label : window;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="show-flights" 
          checked={state.showFlights} 
          onCheckedChange={handleToggleFlights}
        />
        <div className="grid gap-1.5">
          <Label htmlFor="show-flights" className="font-medium flex items-center">
            <Airplane className="h-4 w-4 mr-2" />
            Domestic Flights Required
          </Label>
        </div>
      </div>
      
      {state.showFlights && (
        <div className="space-y-6 pl-6 border-l-2 border-muted mt-2">
          {state.flights.map((flight, index) => (
            <div key={flight.id} className="space-y-4">
              {index > 0 && (
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-medium">Additional Flight {index}</h4>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFlight(flight.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`flight-from-${flight.id}`}>From</Label>
                  <Input
                    id={`flight-from-${flight.id}`}
                    value={flight.from}
                    onChange={(e) => handleFlightChange(flight.id, "from", e.target.value)}
                    placeholder="Departure airport/city"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`flight-to-${flight.id}`}>To</Label>
                  <Input
                    id={`flight-to-${flight.id}`}
                    value={flight.to}
                    onChange={(e) => handleFlightChange(flight.id, "to", e.target.value)}
                    placeholder="Arrival airport/city"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`flight-departure-date-${flight.id}`}>Departure Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id={`flight-departure-date-${flight.id}`}
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {flight.departureDate ? format(new Date(flight.departureDate), "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={flight.departureDate ? new Date(flight.departureDate) : undefined}
                        onSelect={(date) => handleFlightChange(flight.id, "departureDate", date ? format(date, "yyyy-MM-dd") : "")}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`flight-departure-time-${flight.id}`}>Departure Time</Label>
                  <Select 
                    value={flight.departureWindow} 
                    onValueChange={(value) => handleFlightChange(flight.id, "departureWindow", value)}
                  >
                    <SelectTrigger id={`flight-departure-time-${flight.id}`}>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>
                          {formatTimeWindow(flight.departureWindow as TimeWindow)}
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {timeWindowOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`flight-return-date-${flight.id}`}>Return Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id={`flight-return-date-${flight.id}`}
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {flight.returnDate ? format(new Date(flight.returnDate), "PPP") : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={flight.returnDate ? new Date(flight.returnDate) : undefined}
                        onSelect={(date) => handleFlightChange(flight.id, "returnDate", date ? format(date, "yyyy-MM-dd") : "")}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`flight-return-time-${flight.id}`}>Return Time</Label>
                  <Select 
                    value={flight.returnWindow} 
                    onValueChange={(value) => handleFlightChange(flight.id, "returnWindow", value)}
                  >
                    <SelectTrigger id={`flight-return-time-${flight.id}`}>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>
                          {formatTimeWindow(flight.returnWindow as TimeWindow)}
                        </span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {timeWindowOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`flight-frequent-flyer-${flight.id}`}>Frequent Flyer Number (optional)</Label>
                  <Input
                    id={`flight-frequent-flyer-${flight.id}`}
                    value={flight.frequentFlyerNumber}
                    onChange={(e) => handleFlightChange(flight.id, "frequentFlyerNumber", e.target.value)}
                    placeholder="e.g. QF12345678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`flight-seat-preferences-${flight.id}`}>Seat Preferences (optional)</Label>
                  <Input
                    id={`flight-seat-preferences-${flight.id}`}
                    value={flight.seatPreferences}
                    onChange={(e) => handleFlightChange(flight.id, "seatPreferences", e.target.value)}
                    placeholder="e.g. Window, Aisle"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`flight-meal-${flight.id}`}>Meal Requirements (optional)</Label>
                <Input
                  id={`flight-meal-${flight.id}`}
                  value={flight.mealOptions}
                  onChange={(e) => handleFlightChange(flight.id, "mealOptions", e.target.value)}
                  placeholder="e.g. Vegetarian, Gluten-free"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor={`flight-notes-${flight.id}`}>Additional Notes (optional)</Label>
                <Textarea
                  id={`flight-notes-${flight.id}`}
                  value={flight.notes}
                  onChange={(e) => handleFlightChange(flight.id, "notes", e.target.value)}
                  placeholder="Any additional requirements or information"
                  rows={2}
                />
              </div>
              
              {index > 0 && <hr className="my-2" />}
            </div>
          ))}
          
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleAddFlight} 
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Additional Flight
          </Button>
        </div>
      )}
    </div>
  );
};

const CarHireSection = () => {
  const { state, dispatch } = useForm();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: `carHire.${field}`,
      value: e.target.value,
    });
  };

  const handleDateChange = (field: string, date: Date | undefined) => {
    if (date) {
      dispatch({
        type: "UPDATE_FIELD",
        field: `carHire.${field}`,
        value: format(date, "yyyy-MM-dd"),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="car-pickup-location">Pickup Location</Label>
          <Input
            id="car-pickup-location"
            value={state.carHire.pickupLocation}
            onChange={(e) => handleInputChange(e, "pickupLocation")}
            placeholder="Enter pickup location"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="car-dropoff-location">Drop-off Location</Label>
          <Input
            id="car-dropoff-location"
            value={state.carHire.dropoffLocation}
            onChange={(e) => handleInputChange(e, "dropoffLocation")}
            placeholder="Enter drop-off location"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="car-pickup-date">Pickup Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="car-pickup-date"
                variant="outline"
                className="w-full justify-start text-left font-normal"
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
                onSelect={(date) => handleDateChange("pickupDate", date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="car-pickup-time">Pickup Time</Label>
          <Input
            id="car-pickup-time"
            type="time"
            value={state.carHire.pickupTime}
            onChange={(e) => handleInputChange(e, "pickupTime")}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="car-dropoff-date">Drop-off Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="car-dropoff-date"
                variant="outline"
                className="w-full justify-start text-left font-normal"
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
                onSelect={(date) => handleDateChange("dropoffDate", date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="car-dropoff-time">Drop-off Time</Label>
          <Input
            id="car-dropoff-time"
            type="time"
            value={state.carHire.dropoffTime}
            onChange={(e) => handleInputChange(e, "dropoffTime")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vehicle-type">Vehicle Type</Label>
        <Input
          id="vehicle-type"
          value={state.carHire.vehicleType}
          onChange={(e) => handleInputChange(e, "vehicleType")}
          placeholder="e.g. Economy, SUV, etc."
        />
      </div>
    </div>
  );
};

const FerrySection = () => {
  const { state, dispatch } = useForm();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: `ferry.${field}`,
      value: e.target.value,
    });
  };

  const handleDateChange = (field: string, date: Date | undefined) => {
    if (date) {
      dispatch({
        type: "UPDATE_FIELD",
        field: `ferry.${field}`,
        value: format(date, "yyyy-MM-dd"),
      });
    }
  };
  
  const handleTimeWindowChange = (field: string, value: string) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: `ferry.${field}`,
      value
    });
  };
  
  const handleVehicleOnBoardChange = (checked: boolean) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "ferry.vehicleOnBoard",
      value: checked
    });
  };

  // Format time window for display
  const formatTimeWindow = (window: TimeWindow): string => {
    const option = timeWindowOptions.find(opt => opt.value === window);
    return option ? option.label : window;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ferry-from">From</Label>
          <Input
            id="ferry-from"
            value={state.ferry.from}
            onChange={(e) => handleInputChange(e, "from")}
            placeholder="Departure port/harbor"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ferry-to">To</Label>
          <Input
            id="ferry-to"
            value={state.ferry.to}
            onChange={(e) => handleInputChange(e, "to")}
            placeholder="Arrival port/harbor"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ferry-departure-date">Departure Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="ferry-departure-date"
                variant="outline"
                className="w-full justify-start text-left font-normal"
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
                onSelect={(date) => handleDateChange("departureDate", date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ferry-departure-time">Departure Time</Label>
          <Select 
            value={state.ferry.departureWindow} 
            onValueChange={(value) => handleTimeWindowChange("departureWindow", value)}
          >
            <SelectTrigger id="ferry-departure-time">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>
                  {formatTimeWindow(state.ferry.departureWindow as TimeWindow)}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {timeWindowOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ferry-return-date">Return Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="ferry-return-date"
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {state.ferry.returnDate
                  ? format(new Date(state.ferry.returnDate), "PPP")
                  : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={
                  state.ferry.returnDate
                    ? new Date(state.ferry.returnDate)
                    : undefined
                }
                onSelect={(date) => handleDateChange("returnDate", date)}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="ferry-return-time">Return Time</Label>
          <Select 
            value={state.ferry.returnWindow} 
            onValueChange={(value) => handleTimeWindowChange("returnWindow", value)}
          >
            <SelectTrigger id="ferry-return-time">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                <span>
                  {formatTimeWindow(state.ferry.returnWindow as TimeWindow)}
                </span>
              </div>
            </SelectTrigger>
            <SelectContent>
              {timeWindowOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="vehicle-onboard" 
          checked={state.ferry.vehicleOnBoard}
          onCheckedChange={handleVehicleOnBoardChange}
        />
        <Label htmlFor="vehicle-onboard">Vehicle on board</Label>
      </div>
    </div>
  );
};

const PrivateVehicleSection = () => {
  const { state, dispatch } = useForm();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    let value = e.target.value;
    
    // Convert to number if field is estimatedKm
    if (field === "estimatedKm") {
      value = value === "" ? "0" : value;
      const numValue = parseFloat(value);
      
      // Calculate allowance based on km
      const calculatedAllowance = numValue * 0.96;
      
      dispatch({
        type: "UPDATE_FIELD",
        field: "privateVehicle.calculatedAllowance",
        value: calculatedAllowance,
      });
    }
    
    dispatch({
      type: "UPDATE_FIELD",
      field: `privateVehicle.${field}`,
      value,
    });
  };
  
  const handleDepartingFromApprovedChange = (checked: boolean) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "privateVehicle.departingFromApprovedLocation",
      value: checked,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="start-location">Start Location</Label>
          <Input
            id="start-location"
            value={state.privateVehicle.startLocation}
            onChange={(e) => handleInputChange(e, "startLocation")}
            placeholder="Starting point"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-location">End Location</Label>
          <Input
            id="end-location"
            value={state.privateVehicle.endLocation}
            onChange={(e) => handleInputChange(e, "endLocation")}
            placeholder="Destination"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="estimated-km">Estimated Kilometers</Label>
        <Input
          id="estimated-km"
          type="number"
          value={state.privateVehicle.estimatedKm}
          onChange={(e) => handleInputChange(e, "estimatedKm")}
          placeholder="0"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="departing-from-approved" 
          checked={state.privateVehicle.departingFromApprovedLocation}
          onCheckedChange={handleDepartingFromApprovedChange}
        />
        <Label 
          htmlFor="departing-from-approved"
          className="text-sm"
        >
          Departing from depot/approved location (per EA 7.4.1)
        </Label>
      </div>
      
      {state.privateVehicle.estimatedKm > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm text-muted-foreground">
                  Total Distance:
                </span>
                <p className="font-medium">{state.privateVehicle.estimatedKm} km</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Allowance Rate:
                </span>
                <p className="font-medium">$0.96 per km</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  Total Allowance:
                </span>
                <p className="font-medium">${state.privateVehicle.calculatedAllowance.toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const TransportOptions = () => {
  const { state, dispatch } = useForm();
  
  const handleTransportOptionChange = (option: string, checked: boolean) => {
    let updatedOptions = [...state.selectedTransportOptions];
    
    if (checked) {
      if (!updatedOptions.includes(option as any)) {
        updatedOptions.push(option as any);
      }
    } else {
      updatedOptions = updatedOptions.filter(o => o !== option);
    }
    
    dispatch({
      type: "UPDATE_FIELD",
      field: "selectedTransportOptions",
      value: updatedOptions,
    });
  };
  
  const isTransportOptionSelected = (option: string): boolean => {
    return state.selectedTransportOptions.includes(option as any);
  };
  
  // Special handler for flights checkbox that also updates showFlights
  const handleFlightsOptionChange = (checked: boolean) => {
    handleTransportOptionChange("flights", checked);
    
    dispatch({
      type: "UPDATE_FIELD",
      field: "showFlights",
      value: checked
    });
  };
  
  // Handler for private vehicle checkbox
  const handlePrivateVehicleOptionChange = (checked: boolean) => {
    handleTransportOptionChange("private_vehicle", checked);
    
    dispatch({
      type: "UPDATE_FIELD",
      field: "privateVehicle.usePrivateVehicle",
      value: checked
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Transport Options</h2>
        <p className="text-gray-500">Select the transport options you'll need for this trip</p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Transport Requirements</CardTitle>
          <CardDescription>
            Select all options that apply to your travel needs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="flights" 
                checked={isTransportOptionSelected("flights")}
                onCheckedChange={handleFlightsOptionChange}
              />
              <div className="grid gap-1.5">
                <Label htmlFor="flights" className="font-medium flex items-center">
                  <Airplane className="h-4 w-4 mr-2" />
                  Domestic Flights
                </Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="car-hire" 
                checked={isTransportOptionSelected("car_hire")}
                onCheckedChange={(checked) => handleTransportOptionChange("car_hire", checked || false)}
              />
              <div className="grid gap-1.5">
                <Label htmlFor="car-hire" className="font-medium flex items-center">
                  <Car className="h-4 w-4 mr-2" />
                  Car Hire
                </Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="ferry" 
                checked={isTransportOptionSelected("ferry")}
                onCheckedChange={(checked) => handleTransportOptionChange("ferry", checked || false)}
              />
              <div className="grid gap-1.5">
                <Label htmlFor="ferry" className="font-medium flex items-center">
                  <Ship className="h-4 w-4 mr-2" />
                  Ferry
                </Label>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="private-vehicle" 
                checked={isTransportOptionSelected("private_vehicle")}
                onCheckedChange={handlePrivateVehicleOptionChange}
              />
              <div className="grid gap-1.5">
                <Label htmlFor="private-vehicle" className="font-medium flex items-center">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Private Vehicle
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Flights Section */}
      {(isTransportOptionSelected("flights") || state.showFlights) && (
        <Card className="shadow-none border">
          <CardHeader className="pb-3 bg-muted/50">
            <CardTitle className="text-base flex items-center">
              <Airplane className="h-4 w-4 mr-2" />
              Flights
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <FlightSection />
          </CardContent>
        </Card>
      )}

      {/* Car Hire Section */}
      {isTransportOptionSelected("car_hire") && (
        <Card className="shadow-none border">
          <CardHeader className="pb-3 bg-muted/50">
            <CardTitle className="text-base flex items-center">
              <Car className="h-4 w-4 mr-2" />
              Car Hire
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <CarHireSection />
          </CardContent>
        </Card>
      )}

      {/* Ferry Section */}
      {isTransportOptionSelected("ferry") && (
        <Card className="shadow-none border">
          <CardHeader className="pb-3 bg-muted/50">
            <CardTitle className="text-base flex items-center">
              <Ship className="h-4 w-4 mr-2" />
              Ferry
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <FerrySection />
          </CardContent>
        </Card>
      )}

      {/* Private Vehicle Section */}
      {isTransportOptionSelected("private_vehicle") && (
        <Card className="shadow-none border">
          <CardHeader className="pb-3 bg-muted/50">
            <CardTitle className="text-base flex items-center">
              <Briefcase className="h-4 w-4 mr-2" />
              Private Vehicle
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            <PrivateVehicleSection />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TransportOptions;
