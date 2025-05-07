
import React from "react";
import { useForm } from "@/context/FormContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Info, Flag } from "lucide-react";
import { SAPCode, TravelType } from "@/context/FormContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface AllowanceCalculationProps {
  preview?: boolean;
}

const AllowanceCalculation: React.FC<AllowanceCalculationProps> = ({ 
  preview = false 
}) => {
  const { state } = useForm();

  // Get travel classification
  const travelType = state.travelType;

  // Format travel type for display
  const formatTravelType = (type: TravelType): string => {
    switch (type) {
      case "short_stay":
        return "Travel Allowance (Short Stay)";
      case "long_stay":
        return "LAFHA (Long Stay)";
      case "reportable_lafha":
        return "Reportable LAFHA";
      case "aboriginal_land":
        return "Aboriginal Land Allowance";
      default:
        return "Unknown";
    }
  };

  // Get badge variant based on travel type
  const getTravelTypeBadge = (type: TravelType): "default" | "secondary" | "destructive" | "outline" => {
    switch (type) {
      case "short_stay":
        return "default";
      case "long_stay":
        return "secondary";
      case "reportable_lafha":
        return "destructive";
      case "aboriginal_land":
        return "outline";
      default:
        return "outline";
    }
  };

  // Format SAP code name
  const formatSAPCodeName = (code: SAPCode): string => {
    switch (code) {
      case "OR03":
        return "Standard Travel Allowance";
      case "OR23":
        return "LAFHA Standard";
      case "OR24":
        return "Reportable LAFHA";
      case "OR12":
        return "Aboriginal Lands Allowance";
      case "OR13":
        return "Aboriginal Lands Bonus";
      case "0R04":
        return "Vehicle Allowance";
      case "0A53":
        return "Standard Meals";
      case "0A50":
        return "Breakfast Supplement";
      case "0A57":
        return "Remote Meal Supplement";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">
          {preview ? "Travel Duration Classification" : "Allowance Review"}
        </h2>
        <p className="text-gray-500">
          {preview 
            ? "Your trip has been automatically classified based on duration."
            : "Summary of all calculated allowances for this trip."}
        </p>
      </div>

      <Card className="border">
        <CardHeader className="pb-3">
          <CardTitle>Travel Classification</CardTitle>
          <CardDescription>
            Based on your trip details and EA 2024 rules
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-muted-foreground text-sm">
                  Classification:
                </span>
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold mr-2">
                    {formatTravelType(travelType)}
                  </h3>
                  <Badge variant={getTravelTypeBadge(travelType)}>
                    {state.isAboriginalLand 
                      ? "Aboriginal Land" 
                      : travelType === "short_stay" 
                        ? "Travel Allowance" 
                        : "LAFHA"}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <span className="text-muted-foreground text-sm">Consecutive Nights:</span>
                <p className="text-lg font-semibold">{state.consecutiveNights}</p>
              </div>
            </div>
            
            {state.hasPersonalTravel && state.personalTravelDates.length > 0 && (
              <div className="p-3 rounded-md bg-amber-100 border border-amber-300 text-sm">
                <div className="flex">
                  <div className="mr-2 mt-0.5">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                  </div>
                  <div className="text-amber-800">
                    <p className="font-medium">Personal Travel Dates Impact</p>
                    <p>
                      {state.personalTravelDates.length} {state.personalTravelDates.length === 1 ? 'day' : 'days'} of
                      personal travel have been excluded from your allowance calculation.
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {state.isAboriginalLand ? (
              <div className="p-3 rounded-md bg-amber-50 text-sm">
                <div className="flex">
                  <div className="mr-2 mt-0.5">
                    <Flag className="h-4 w-4 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-amber-800">Aboriginal Land Allowance:</p>
                    <p className="text-amber-700">
                      This trip is classified as Aboriginal Land travel, with a base rate of $268.34 per day.
                      {state.aboriginalLandBonus && " An additional bonus of $21.20 per day has been added."}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 rounded-md bg-muted text-sm">
                <div className="flex">
                  <div className="mr-2 mt-0.5">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold">Classification Rules:</p>
                    <ul className="list-disc ml-5 mt-1 text-muted-foreground">
                      <li>&lt; 21 consecutive nights AND &lt; 90 cumulative days → <strong>Travel Allowance</strong></li>
                      <li>≥ 21 nights OR ≥ 90 days → <strong>LAFHA</strong></li>
                      <li>≥ 365 days → <strong>Reportable LAFHA</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {travelType === "reportable_lafha" && (
              <div className="flex p-3 rounded-md bg-destructive/10 text-sm">
                <div className="mr-2 mt-0.5">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                </div>
                <div className="text-destructive">
                  <p className="font-medium">Reportable LAFHA Warning</p>
                  <p>
                    This trip exceeds 365 days and will be subject to additional reporting 
                    requirements. Please contact the payroll department.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {!preview && (
        <>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Allowance Calculation</CardTitle>
              <CardDescription>
                Summary of calculated allowances for this trip
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {state.isAboriginalLand ? (
                    <>
                      <TableRow>
                        <TableCell className="font-medium">Aboriginal Land Base</TableCell>
                        <TableCell>
                          $268.34 × {state.calculatedAllowances.totalDays} days
                        </TableCell>
                        <TableCell className="text-right">
                          ${(268.34 * state.calculatedAllowances.totalDays).toFixed(2)}
                        </TableCell>
                      </TableRow>
                      
                      {state.aboriginalLandBonus && (
                        <TableRow>
                          <TableCell className="font-medium">Aboriginal Land Bonus</TableCell>
                          <TableCell>
                            $21.20 × {state.calculatedAllowances.totalDays} days
                          </TableCell>
                          <TableCell className="text-right">
                            ${state.calculatedAllowances.aboriginalLandBonus.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ) : (
                    <>
                      {state.calculatedAllowances.accommodation > 0 && (
                        <TableRow>
                          <TableCell className="font-medium">Accommodation</TableCell>
                          <TableCell>
                            {state.accommodationType === "ctm" ? "CTM Booked" : 
                             state.accommodationType === "private" ? "Private Accommodation" : 
                             "Self-booked"}
                          </TableCell>
                          <TableCell className="text-right">${state.calculatedAllowances.accommodation.toFixed(2)}</TableCell>
                        </TableRow>
                      )}

                      {state.calculatedAllowances.meals > 0 && (
                        <TableRow>
                          <TableCell className="font-medium">Meals</TableCell>
                          <TableCell>
                            Eligible meals for {state.calculatedAllowances.totalDays} days
                          </TableCell>
                          <TableCell className="text-right">${state.calculatedAllowances.meals.toFixed(2)}</TableCell>
                        </TableRow>
                      )}
                    </>
                  )}

                  {state.privateVehicle.calculatedAllowance > 0 && (
                    <TableRow>
                      <TableCell className="font-medium">Vehicle</TableCell>
                      <TableCell>
                        {state.privateVehicle.estimatedKm} km @ $0.96/km
                      </TableCell>
                      <TableCell className="text-right">${state.privateVehicle.calculatedAllowance.toFixed(2)}</TableCell>
                    </TableRow>
                  )}

                  {state.calculatedAllowances.uplifts > 0 && (
                    <TableRow>
                      <TableCell className="font-medium">Condition Uplifts</TableCell>
                      <TableCell>
                        {state.isRemote && "Remote Location, "}
                        {state.isSubstandard && "Substandard Accommodation, "}
                        {state.isShortNotice && "Short Notice"}
                      </TableCell>
                      <TableCell className="text-right">${state.calculatedAllowances.uplifts.toFixed(2)}</TableCell>
                    </TableRow>
                  )}

                  <TableRow className="font-medium">
                    <TableCell colSpan={2} className="text-right">Total:</TableCell>
                    <TableCell className="text-right">${state.calculatedAllowances.total.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Trip Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-sm text-muted-foreground">Total Nights:</span>
                    <p className="font-medium">{state.calculatedAllowances.totalNights}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Total Days:</span>
                    <p className="font-medium">{state.calculatedAllowances.totalDays}</p>
                  </div>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Work Location:</span>
                  <p className="font-medium flex items-center">
                    {state.workLocation}
                    {state.isAboriginalLand && <Flag className="h-4 w-4 ml-2 text-amber-500" />}
                  </p>
                </div>
                
                {state.hasPersonalTravel && state.personalTravelDates.length > 0 && (
                  <div>
                    <span className="text-sm text-muted-foreground flex items-center">
                      Personal Travel Days:
                      <Badge variant="outline" className="ml-2 text-amber-700 bg-amber-50 border-amber-200">
                        {state.personalTravelDates.length} days excluded
                      </Badge>
                    </span>
                    <p className="text-xs text-amber-700 mt-1">
                      No allowances are paid for personal travel dates
                    </p>
                  </div>
                )}
                
                <div className="pt-2">
                  <span className="text-sm text-muted-foreground">Departure:</span>
                  <p className="font-medium">
                    {state.departureDate} at {state.departureTime}
                  </p>
                </div>
                
                <div>
                  <span className="text-sm text-muted-foreground">Return:</span>
                  <p className="font-medium">
                    {state.returnDate} at {state.returnTime}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">Special Conditions</CardTitle>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent side="left">
                        <p className="w-[220px]">
                          Special conditions may affect your allowance rates.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {state.isAboriginalLand ? (
                  <div className="flex p-3 rounded-md bg-amber-50 border border-amber-100 text-sm">
                    <div className="mr-2 mt-0.5">
                      <Flag className="h-4 w-4 text-amber-600" />
                    </div>
                    <div className="text-amber-700">
                      <p className="font-medium">Aboriginal Land Allowance</p>
                      <p>
                        Base rate of $268.34 per day applies.
                        {state.aboriginalLandBonus && " Direct work on Aboriginal Land bonus of $21.20 per day also applies."}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <span className="text-sm text-muted-foreground">FBT Applicable:</span>
                      <div className="flex items-center">
                        <p className="font-medium mr-2">
                          {state.calculatedAllowances.fbtApplicable ? "Yes" : "No"}
                        </p>
                        <Badge variant={state.calculatedAllowances.fbtApplicable ? "outline" : "secondary"}>
                          {state.calculatedAllowances.fbtApplicable ? "FBT Applies" : "No FBT"}
                        </Badge>
                      </div>
                    </div>

                    {state.accommodationType === "self_booked" && (
                      <div className="flex p-3 rounded-md bg-amber-50 border border-amber-100 text-sm">
                        <div className="mr-2 mt-0.5">
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                        </div>
                        <div className="text-amber-700">
                          <p className="font-medium">Self-booked Accommodation</p>
                          <p>
                            Receipts must be uploaded after travel for reimbursement.
                          </p>
                        </div>
                      </div>
                    )}

                    {state.isRemote || state.isSubstandard || state.isShortNotice ? (
                      <div className="flex p-3 rounded-md bg-blue-50 border border-blue-100 text-sm">
                        <div className="mr-2 mt-0.5">
                          <Info className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="text-blue-700">
                          <p className="font-medium">Special Conditions Applied</p>
                          <ul className="list-disc ml-5 mt-1">
                            {state.isRemote && <li>Remote Location (20% uplift)</li>}
                            {state.isSubstandard && <li>Substandard Accommodation (15% uplift)</li>}
                            {state.isShortNotice && <li>Short Notice Booking (10% uplift)</li>}
                          </ul>
                        </div>
                      </div>
                    ) : null}
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AllowanceCalculation;
