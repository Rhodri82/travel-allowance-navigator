
import React from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { HelpCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  calculateAccommodationRate,
} from "@/utils/calculationUtils";

const AccommodationRequirements = () => {
  const { state, dispatch } = useForm();

  // Handle accommodation required toggle
  const handleAccommodationRequiredChange = (checked: boolean) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "accommodationRequired",
      value: checked,
    });

    // Reset accommodation type if toggled off
    if (!checked) {
      dispatch({
        type: "UPDATE_FIELD",
        field: "accommodationType",
        value: "",
      });
    }
  };

  // Handle accommodation type change
  const handleAccommodationTypeChange = (value: string) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "accommodationType",
      value,
    });
  };

  // Handle checkbox changes
  const handleCheckboxChange = (
    checked: boolean,
    field: "isRemote" | "isSubstandard" | "isShortNotice"
  ) => {
    dispatch({
      type: "UPDATE_FIELD",
      field,
      value: checked,
    });

    // Recalculate accommodation rate when conditions change
    const rate = calculateAccommodationRate(
      state.travelType,
      field === "isRemote" ? checked : state.isRemote,
      field === "isSubstandard" ? checked : state.isSubstandard,
      field === "isShortNotice" ? checked : state.isShortNotice,
      state.accommodationType,
      true // Always assume approved now, as per requirements
    );

    dispatch({
      type: "UPDATE_FIELD",
      field: "accommodationRate",
      value: rate,
    });
  };

  // Calculate and display accommodation rate
  const currentRate = calculateAccommodationRate(
    state.travelType,
    state.isRemote,
    state.isSubstandard,
    state.isShortNotice,
    state.accommodationType || "",
    true // Always assume approved now, as per requirements
  );

  // Determine if field has error
  const hasError = (field: string) => {
    return Boolean(state.errors[field]);
  };

  // Determine accommodation rate based on type
  const getAccommodationRateDisplay = (type: string): string => {
    switch (type) {
      case "ctm":
        return "$148.70/day";
      case "private":
        return "$268.34/day";
      case "self_booked":
        return "$289.70/day";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Accommodation Requirements</h2>
        <p className="text-gray-500">
          Please specify if accommodation is required for this trip.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="accommodation-required"
          checked={state.accommodationRequired}
          onCheckedChange={handleAccommodationRequiredChange}
        />
        <Label htmlFor="accommodation-required">Accommodation required?</Label>
      </div>

      {state.accommodationRequired && (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label 
              htmlFor="accommodation-type"
              className={hasError("accommodationType") ? "text-destructive" : ""}
            >
              Accommodation Type
            </Label>
            <Select
              value={state.accommodationType}
              onValueChange={handleAccommodationTypeChange}
            >
              <SelectTrigger 
                id="accommodation-type"
                className={hasError("accommodationType") ? "border-destructive" : ""}
              >
                <SelectValue placeholder="Select accommodation type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ctm">CTM Booked ({getAccommodationRateDisplay("ctm")})</SelectItem>
                <SelectItem value="private">Private - friends/family ({getAccommodationRateDisplay("private")})</SelectItem>
                <SelectItem value="self_booked">Self-booked ({getAccommodationRateDisplay("self_booked")})</SelectItem>
              </SelectContent>
            </Select>
            {hasError("accommodationType") && (
              <p className="text-destructive text-sm mt-1">
                {state.errors.accommodationType}
              </p>
            )}
          </div>

          {state.accommodationType === "self_booked" && (
            <Card className="border-dashed">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Self-booked Accommodation</CardTitle>
                <CardDescription>
                  Important information for self-booked accommodation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-muted/50 rounded-md text-sm space-y-2">
                  <div className="flex">
                    <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <p>
                      Receipts must be uploaded after travel for reimbursement.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            <h3 className="text-base font-medium">Special Conditions</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="is-remote"
                  checked={state.isRemote}
                  onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, "isRemote")}
                />
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Label htmlFor="is-remote" className="mr-1">Remote Location</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[220px]">
                            Applies to locations more than 100km from a major urban center. 
                            Triggers 20% uplift per EA 7.3.4.1.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Locations &gt;100km from major urban centers
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="is-substandard"
                  checked={state.isSubstandard}
                  onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, "isSubstandard")}
                />
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Label htmlFor="is-substandard" className="mr-1">Substandard Accommodation</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[220px]">
                            Applies when standard accommodation is unavailable.
                            Triggers 15% uplift per EA 7.3.4.2.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    When standard accommodation is unavailable
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="is-short-notice"
                  checked={state.isShortNotice}
                  onCheckedChange={(checked) => handleCheckboxChange(checked as boolean, "isShortNotice")}
                />
                <div className="space-y-1">
                  <div className="flex items-center">
                    <Label htmlFor="is-short-notice" className="mr-1">Short Notice</Label>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="w-[220px]">
                            Applies to bookings made with less than 48 hours' notice.
                            Triggers 10% uplift per EA 7.3.4.3.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Bookings with less than 48 hours' notice
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Accommodation Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Total nights:</span>
                  <p className="font-medium">{state.consecutiveNights || 0} nights</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Rate per night:</span>
                  <p className="font-medium">${currentRate.toFixed(2)}</p>
                </div>
                <div className="col-span-2">
                  <span className="text-sm text-muted-foreground">Estimated total:</span>
                  <p className="font-medium text-lg">
                    ${(currentRate * (state.consecutiveNights || 0)).toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700">
            <p>
              <strong>Note:</strong> Uplift conditions are stackable. Multiple conditions will compound the rate increase.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccommodationRequirements;
