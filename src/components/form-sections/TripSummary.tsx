
import React, { useState } from "react";
import { useForm } from "@/context/FormContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarIcon, Clock, Flag, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const TripSummary = () => {
  const { state, dispatch } = useForm();
  const [personalDate, setPersonalDate] = useState<Date | undefined>(undefined);

  // Handle trip purpose change
  const handleTripPurposeChange = (value: string) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "tripPurpose",
      value,
    });
  };

  // Handle other fields change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    dispatch({
      type: "UPDATE_FIELD",
      field,
      value: e.target.value,
    });
  };

  // Handle departure date change
  const handleDepartureDateChange = (date: Date | undefined) => {
    if (date) {
      dispatch({
        type: "UPDATE_FIELD",
        field: "departureDate",
        value: format(date, "yyyy-MM-dd"),
      });
    }
  };

  // Handle return date change
  const handleReturnDateChange = (date: Date | undefined) => {
    if (date) {
      dispatch({
        type: "UPDATE_FIELD",
        field: "returnDate",
        value: format(date, "yyyy-MM-dd"),
      });
    }
  };

  // Handle time change
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>, field: string) => {
    dispatch({
      type: "UPDATE_FIELD",
      field,
      value: e.target.value,
    });
  };

  // Handle aboriginal land toggle
  const handleAboriginalLandChange = (checked: boolean) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "isAboriginalLand",
      value: checked,
    });
  };

  // Handle personal travel toggle
  const handlePersonalTravelToggle = (checked: boolean) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "hasPersonalTravel",
      value: checked,
    });

    // Clear personal travel dates if toggled off
    if (!checked) {
      dispatch({
        type: "UPDATE_FIELD",
        field: "personalTravelDates",
        value: [],
      });
    }
  };

  // Add personal travel date
  const handleAddPersonalTravelDate = () => {
    if (personalDate) {
      const dateString = format(personalDate, "yyyy-MM-dd");
      
      // Check if date is between departure and return
      const departureDate = state.departureDate ? new Date(state.departureDate) : null;
      const returnDate = state.returnDate ? new Date(state.returnDate) : null;
      
      if (departureDate && returnDate && personalDate >= departureDate && personalDate <= returnDate) {
        dispatch({
          type: "ADD_PERSONAL_TRAVEL_DATE",
          date: dateString,
        });
        
        setPersonalDate(undefined);
      } else {
        alert("Personal travel date must be within the trip duration.");
      }
    }
  };

  // Remove personal travel date
  const handleRemovePersonalTravelDate = (date: string) => {
    dispatch({
      type: "REMOVE_PERSONAL_TRAVEL_DATE",
      date,
    });
  };

  // Determine if field has error
  const hasError = (field: string) => {
    return Boolean(state.errors[field]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Trip Summary</h2>
        <p className="text-gray-500">
          Please provide details about the purpose and duration of the trip.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label 
              htmlFor="trip-purpose"
              className={hasError("tripPurpose") ? "text-destructive" : ""}
            >
              Trip Purpose
            </Label>
            <Select
              value={state.tripPurpose}
              onValueChange={handleTripPurposeChange}
            >
              <SelectTrigger id="trip-purpose" className={hasError("tripPurpose") ? "border-destructive" : ""}>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="work">Work</SelectItem>
                <SelectItem value="training">Training</SelectItem>
                <SelectItem value="conference">Conference</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            {hasError("tripPurpose") && (
              <p className="text-destructive text-sm mt-1">
                {state.errors.tripPurpose}
              </p>
            )}
          </div>

          {state.tripPurpose === "other" && (
            <div className="space-y-2">
              <Label 
                htmlFor="trip-purpose-other"
                className={hasError("tripPurposeOther") ? "text-destructive" : ""}
              >
                Please specify
              </Label>
              <Input
                id="trip-purpose-other"
                value={state.tripPurposeOther || ""}
                onChange={(e) => handleInputChange(e, "tripPurposeOther")}
                placeholder="Specify purpose"
                className={hasError("tripPurposeOther") ? "border-destructive" : ""}
              />
              {hasError("tripPurposeOther") && (
                <p className="text-destructive text-sm mt-1">
                  {state.errors.tripPurposeOther}
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label 
                htmlFor="work-location"
                className={hasError("workLocation") ? "text-destructive" : ""}
              >
                Location of Work
              </Label>
            </div>
            <Input
              id="work-location"
              value={state.workLocation}
              onChange={(e) => handleInputChange(e, "workLocation")}
              placeholder="Enter work location"
              className={hasError("workLocation") ? "border-destructive" : ""}
            />
            {hasError("workLocation") && (
              <p className="text-destructive text-sm mt-1">
                {state.errors.workLocation}
              </p>
            )}
            
            {/* Aboriginal Land Checkbox */}
            <div className="flex items-center space-x-2 mt-2">
              <Checkbox 
                id="aboriginal-land" 
                checked={state.isAboriginalLand}
                onCheckedChange={handleAboriginalLandChange}
              />
              <div className="grid gap-1">
                <Label 
                  htmlFor="aboriginal-land"
                  className="flex items-center text-sm font-medium"
                >
                  Aboriginal Land
                  <Flag className="h-4 w-4 ml-2 text-amber-500" />
                </Label>
                {state.isAboriginalLand && (
                  <p className="text-xs text-muted-foreground">
                    This trip will be eligible for the fixed Aboriginal Land allowance of $280 per day.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label 
                htmlFor="work-order"
                className={hasError("workOrder") ? "text-destructive" : ""}
              >
                Work Order
              </Label>
              <Input
                id="work-order"
                value={state.workOrder}
                onChange={(e) => handleInputChange(e, "workOrder")}
                placeholder="Work order number"
                className={hasError("workOrder") ? "border-destructive" : ""}
              />
              {hasError("workOrder") && (
                <p className="text-destructive text-sm mt-1">
                  {state.errors.workOrder}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label 
                htmlFor="cost-centre"
                className={hasError("costCentre") ? "text-destructive" : ""}
              >
                Cost Centre
              </Label>
              <Input
                id="cost-centre"
                value={state.costCentre}
                onChange={(e) => handleInputChange(e, "costCentre")}
                placeholder="Cost centre code"
                className={hasError("costCentre") ? "border-destructive" : ""}
              />
              {hasError("costCentre") && (
                <p className="text-destructive text-sm mt-1">
                  {state.errors.costCentre}
                </p>
              )}
            </div>
          </div>
          {hasError("financials") && (
            <p className="text-destructive text-sm mt-1">
              {state.errors.financials}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label 
                htmlFor="departure-date"
                className={hasError("departureDate") ? "text-destructive" : ""}
              >
                Departure Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="departure-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !state.departureDate && "text-muted-foreground",
                      hasError("departureDate") && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {state.departureDate ? format(new Date(state.departureDate), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={state.departureDate ? new Date(state.departureDate) : undefined}
                    onSelect={handleDepartureDateChange}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {hasError("departureDate") && (
                <p className="text-destructive text-sm mt-1">
                  {state.errors.departureDate}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label 
                htmlFor="departure-time"
                className={hasError("departureTime") ? "text-destructive" : ""}
              >
                Departure Time
              </Label>
              <div className="flex">
                <Input
                  id="departure-time"
                  type="time"
                  value={state.departureTime}
                  onChange={(e) => handleTimeChange(e, "departureTime")}
                  className={cn("flex-grow", hasError("departureTime") && "border-destructive")}
                />
              </div>
              {hasError("departureTime") && (
                <p className="text-destructive text-sm mt-1">
                  {state.errors.departureTime}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label 
                htmlFor="return-date"
                className={hasError("returnDate") ? "text-destructive" : ""}
              >
                Return Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="return-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !state.returnDate && "text-muted-foreground",
                      hasError("returnDate") && "border-destructive"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {state.returnDate ? format(new Date(state.returnDate), "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={state.returnDate ? new Date(state.returnDate) : undefined}
                    onSelect={handleReturnDateChange}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
              {hasError("returnDate") && (
                <p className="text-destructive text-sm mt-1">
                  {state.errors.returnDate}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label 
                htmlFor="return-time"
                className={hasError("returnTime") ? "text-destructive" : ""}
              >
                Return Time
              </Label>
              <div className="flex">
                <Input
                  id="return-time"
                  type="time"
                  value={state.returnTime}
                  onChange={(e) => handleTimeChange(e, "returnTime")}
                  className={cn("flex-grow", hasError("returnTime") && "border-destructive")}
                />
              </div>
              {hasError("returnTime") && (
                <p className="text-destructive text-sm mt-1">
                  {state.errors.returnTime}
                </p>
              )}
            </div>
          </div>

          <Card className={cn("border-dashed", state.hasPersonalTravel && "border-amber-300 bg-amber-50")}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className={cn("text-base", state.hasPersonalTravel && "text-amber-800")}>
                    Personal Travel
                    {state.hasPersonalTravel && " (Impacts Allowance)"}
                  </CardTitle>
                  <CardDescription className={state.hasPersonalTravel ? "text-amber-700" : ""}>
                    Declare any personal days during this trip
                  </CardDescription>
                </div>
                <Switch
                  checked={state.hasPersonalTravel}
                  onCheckedChange={handlePersonalTravelToggle}
                />
              </div>
            </CardHeader>
            {state.hasPersonalTravel && (
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-end space-x-2">
                    <div className="flex-grow space-y-2">
                      <Label htmlFor="personal-travel-date">Add Personal Travel Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="personal-travel-date"
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {personalDate ? format(personalDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={personalDate}
                            onSelect={setPersonalDate}
                            initialFocus
                            className="pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <Button
                      type="button"
                      onClick={handleAddPersonalTravelDate}
                      disabled={!personalDate}
                    >
                      Add Date
                    </Button>
                  </div>

                  {state.personalTravelDates.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {state.personalTravelDates.map((date) => (
                        <Badge
                          key={date}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {format(new Date(date), "dd MMM yyyy")}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => handleRemovePersonalTravelDate(date)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  )}
                  {hasError("personalTravelDates") && (
                    <p className="text-destructive text-sm">
                      {state.errors.personalTravelDates}
                    </p>
                  )}

                  <div className="p-3 border border-amber-200 rounded-md bg-amber-50/50 text-amber-800">
                    <p className="text-sm font-medium">Important:</p>
                    <ul className="text-sm list-disc pl-5 mt-1">
                      <li>Personal travel dates will be excluded from allowance calculations</li>
                      <li>No accommodation or meal allowances will be provided on these dates</li>
                      <li>These dates may affect your LAFHA classification</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TripSummary;
