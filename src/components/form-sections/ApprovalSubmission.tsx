
import React, { useRef } from "react";
import { useForm } from "@/context/FormContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CircleCheck,
  FileUp,
  Info,
  Pencil,
  TimerReset,
  Trash2,
  Upload,
  UserCheck,
  Download,
  FileText,
  Flag,
  Bed,
  Car,
  Utensils,
  BadgeDollarSign,
  Calendar,
  BadgePercent,
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { TravelType } from "@/context/FormContext";

const ApprovalSubmission = () => {
  const { state, dispatch } = useForm();
  const printRef = useRef<HTMLDivElement>(null);
  
  // Create file input reference
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handle declaration checkbox
  const handleDeclarationChange = (checked: boolean) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "declaration",
      value: checked,
    });
  };

  // Handle attachment upload
  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      Array.from(e.target.files).forEach(file => {
        dispatch({
          type: "ADD_ATTACHMENT",
          file,
        });
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle attachment removal
  const handleRemoveAttachment = (index: number) => {
    dispatch({
      type: "REMOVE_ATTACHMENT",
      index,
    });
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Determine if field has error
  const hasError = (field: string) => {
    return Boolean(state.errors[field]);
  };

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
  const getTravelTypeBadge = (type: TravelType) => {
    switch (type) {
      case "short_stay":
        return "default";
      case "long_stay":
        return "secondary";
      case "reportable_lafha":
        return "destructive";
      case "aboriginal_land":
        return "warning";
      default:
        return "outline";
    }
  };

  // Format accommodation type for display
  const formatAccommodationType = (type: string): string => {
    switch (type) {
      case "ctm":
        return "Corporate Travel Management (CTM)";
      case "private":
        return "Private Accommodation";
      case "self_booked":
        return "Self-Booked Accommodation";
      default:
        return "None";
    }
  };

  // Format SAP code name
  const formatSAPCodeName = (code: string): string => {
    switch (code) {
      case "OR03":
        return "Standard Travel Allowance";
      case "OR23":
        return "LAFHA Standard";
      case "OR24":
        return "Reportable LAFHA";
      case "OR12":
      case "OR13":
        return "Aboriginal Lands Allowance";
      case "0R04":
        return "Vehicle Allowance";
      case "0A53":
        return "Standard Meals";
      case "0A50":
        return "Breakfast Supplement";
      case "0A57":
        return "Remote Meal Supplement";
      default:
        return code;
    }
  };

  // Print or export as PDF
  const handlePrint = () => {
    if (printRef.current) {
      const content = printRef.current;
      const printWindow = window.open('', '_blank');
      
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Travel & LAFHA Request Summary</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  line-height: 1.6;
                  color: #333;
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 20px;
                }
                h1, h2, h3 { margin-top: 20px; }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 15px 0;
                }
                table, th, td {
                  border: 1px solid #ddd;
                }
                th, td {
                  padding: 10px;
                  text-align: left;
                }
                th {
                  background-color: #f2f2f2;
                }
                .badge {
                  display: inline-block;
                  padding: 3px 8px;
                  border-radius: 12px;
                  font-size: 12px;
                  font-weight: 600;
                  background-color: #e0e0e0;
                }
                .section {
                  margin-bottom: 20px;
                  padding-bottom: 10px;
                  border-bottom: 1px solid #eee;
                }
                .row {
                  display: flex;
                  margin-bottom: 10px;
                }
                .col {
                  flex: 1;
                }
                .label {
                  font-weight: 600;
                  color: #666;
                  font-size: 14px;
                }
                .value {
                  font-size: 16px;
                }
                .signature-area {
                  margin-top: 40px;
                  border-top: 1px dashed #ccc;
                  padding-top: 20px;
                }
              </style>
            </head>
            <body>
              <h1>Travel & LAFHA Request Summary</h1>
              ${content.innerHTML}
              <div class="signature-area">
                <p class="label">Traveler Signature:</p>
                <div style="height: 50px; border-bottom: 1px solid #333; margin-bottom: 20px;"></div>
                <p class="label">Approver Signature:</p>
                <div style="height: 50px; border-bottom: 1px solid #333; margin-bottom: 20px;"></div>
              </div>
              <script>
                window.onload = function() { window.print(); }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  const captureScreenshot = () => {
    alert("Screenshot functionality would typically use a library like html2canvas or similar to capture the summary content.");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Summary & Approval</h2>
        <p className="text-gray-500">
          Review your request details and submit for approval.
        </p>
      </div>

      {/* Trip Classification Section */}
      <Card className="border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Travel Classification</CardTitle>
              <CardDescription>
                Based on your trip details and EA 2024 rules
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1.5"
                onClick={handlePrint}
              >
                <FileText className="h-4 w-4" />
                <span>Print</span>
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1.5"
                onClick={captureScreenshot}
              >
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6" ref={printRef}>
            <div className="p-4 bg-muted/30 rounded-md">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Classification:</span>
                  <div className="flex items-center mt-1">
                    <h3 className="text-lg font-semibold mr-2">
                      {formatTravelType(state.travelType)}
                    </h3>
                    <Badge variant={getTravelTypeBadge(state.travelType)}>
                      {state.isAboriginalLand 
                        ? "Aboriginal Land" 
                        : state.travelType === "short_stay" 
                          ? "Travel Allowance" 
                          : "LAFHA"}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm text-muted-foreground">Total Allowance:</span>
                  <p className="text-lg font-bold">${state.calculatedAllowances.total.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Traveler & Trip Details */}
            <div>
              <h3 className="text-base font-medium flex items-center mb-2">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                Trip Details
              </h3>
              <div className="rounded-md border">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="w-1/3 font-medium text-muted-foreground">Trip Purpose</TableCell>
                      <TableCell>{state.tripPurpose === "other" ? state.tripPurposeOther : state.tripPurpose}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">Work Location</TableCell>
                      <TableCell className="flex items-center">
                        {state.workLocation}
                        {state.isAboriginalLand && (
                          <Badge variant="warning" className="ml-2">Aboriginal Land</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">Departure</TableCell>
                      <TableCell>{state.departureDate} at {state.departureTime}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">Return</TableCell>
                      <TableCell>{state.returnDate} at {state.returnTime}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">Consecutive Nights</TableCell>
                      <TableCell>{state.consecutiveNights}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">Cumulative Days</TableCell>
                      <TableCell>{state.cumulativeDays + state.consecutiveNights} (including this trip)</TableCell>
                    </TableRow>
                    {state.hasPersonalTravel && state.personalTravelDates.length > 0 && (
                      <TableRow>
                        <TableCell className="font-medium text-muted-foreground">Personal Days</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span>{state.personalTravelDates.length} days excluded</span>
                            <Badge variant="outline" className="ml-2">Not eligible for allowance</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {state.personalTravelDates.join(", ")}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Accommodation Details */}
            <div>
              <h3 className="text-base font-medium flex items-center mb-2">
                <Bed className="h-4 w-4 mr-2 text-muted-foreground" />
                Accommodation Details
              </h3>
              <div className="rounded-md border">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="w-1/3 font-medium text-muted-foreground">Accommodation Required</TableCell>
                      <TableCell>{state.accommodationRequired ? "Yes" : "No"}</TableCell>
                    </TableRow>
                    {state.accommodationRequired && (
                      <>
                        <TableRow>
                          <TableCell className="font-medium text-muted-foreground">Accommodation Type</TableCell>
                          <TableCell>{formatAccommodationType(state.accommodationType)}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-muted-foreground">Nights</TableCell>
                          <TableCell>{state.accommodationNights}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium text-muted-foreground">Special Conditions</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-2">
                              {state.isRemote && <Badge>Remote Location</Badge>}
                              {state.isSubstandard && <Badge>Substandard</Badge>}
                              {state.isShortNotice && <Badge>Short Notice</Badge>}
                              {!state.isRemote && !state.isSubstandard && !state.isShortNotice && "None"}
                            </div>
                          </TableCell>
                        </TableRow>
                      </>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Transport & Meals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Transport Section */}
              <div>
                <h3 className="text-base font-medium flex items-center mb-2">
                  <Car className="h-4 w-4 mr-2 text-muted-foreground" />
                  Transport
                </h3>
                <div className="rounded-md border">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium text-muted-foreground">Transport Options</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-2">
                            {state.selectedTransportOptions.map(option => (
                              <Badge key={option} variant="outline">{option}</Badge>
                            ))}
                          </div>
                        </TableCell>
                      </TableRow>
                      {state.privateVehicle.usePrivateVehicle && (
                        <TableRow>
                          <TableCell className="font-medium text-muted-foreground">Private Vehicle</TableCell>
                          <TableCell>
                            {state.privateVehicle.estimatedKm} km
                            <div className="text-sm text-muted-foreground mt-1">
                              {state.privateVehicle.startLocation} to {state.privateVehicle.endLocation}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Meals Section */}
              <div>
                <h3 className="text-base font-medium flex items-center mb-2">
                  <Utensils className="h-4 w-4 mr-2 text-muted-foreground" />
                  Meals
                </h3>
                <div className="rounded-md border">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium text-muted-foreground">Eligible for Meals</TableCell>
                        <TableCell>{state.eligibleForMeals ? "Yes" : "No"}</TableCell>
                      </TableRow>
                      {state.eligibleForMeals && (
                        <>
                          <TableRow>
                            <TableCell className="font-medium text-muted-foreground">Meals Provided</TableCell>
                            <TableCell>
                              {state.mealsProvided ? (
                                <div className="space-y-1">
                                  <div className="flex flex-wrap gap-2">
                                    {state.providedMeals.map(meal => (
                                      <Badge key={meal} variant="outline">{meal}</Badge>
                                    ))}
                                  </div>
                                  <p className="text-xs text-muted-foreground">
                                    These meals are excluded from allowance calculation
                                  </p>
                                </div>
                              ) : "None"}
                            </TableCell>
                          </TableRow>
                          {state.breakfastEligible && (
                            <TableRow>
                              <TableCell className="font-medium text-muted-foreground">Breakfast Supplement</TableCell>
                              <TableCell>
                                <Badge>Eligible</Badge>
                                <div className="text-xs text-muted-foreground mt-1">
                                  Due to early departure
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>

            {/* Allowance Details */}
            <div>
              <h3 className="text-base font-medium flex items-center mb-2">
                <BadgeDollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                Allowance Calculation
              </h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>SAP Code</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {state.calculatedAllowances.sapCodes.includes('OR12') && (
                      <TableRow>
                        <TableCell>
                          <span className="font-mono">OR12/OR13</span>
                        </TableCell>
                        <TableCell>Aboriginal Lands Allowance</TableCell>
                        <TableCell className="text-right">${state.calculatedAllowances.accommodation.toFixed(2)}</TableCell>
                      </TableRow>
                    )}
                    
                    {state.calculatedAllowances.accommodation > 0 && !state.calculatedAllowances.sapCodes.includes('OR12') && (
                      <TableRow>
                        <TableCell>
                          <span className="font-mono">{state.calculatedAllowances.sapCodes[0]}</span>
                        </TableCell>
                        <TableCell>{formatSAPCodeName(state.calculatedAllowances.sapCodes[0])}</TableCell>
                        <TableCell className="text-right">${state.calculatedAllowances.accommodation.toFixed(2)}</TableCell>
                      </TableRow>
                    )}

                    {state.calculatedAllowances.meals > 0 && (
                      <TableRow>
                        <TableCell>
                          <span className="font-mono">0A53</span>
                        </TableCell>
                        <TableCell>Meals Allowance</TableCell>
                        <TableCell className="text-right">${state.calculatedAllowances.meals.toFixed(2)}</TableCell>
                      </TableRow>
                    )}

                    {state.privateVehicle.calculatedAllowance > 0 && (
                      <TableRow>
                        <TableCell>
                          <span className="font-mono">0R04</span>
                        </TableCell>
                        <TableCell>Vehicle Allowance</TableCell>
                        <TableCell className="text-right">${state.privateVehicle.calculatedAllowance.toFixed(2)}</TableCell>
                      </TableRow>
                    )}

                    {state.calculatedAllowances.uplifts > 0 && (
                      <TableRow>
                        <TableCell>
                          <span className="font-mono">UPLF</span>
                        </TableCell>
                        <TableCell>Location/Condition Uplifts</TableCell>
                        <TableCell className="text-right">${state.calculatedAllowances.uplifts.toFixed(2)}</TableCell>
                      </TableRow>
                    )}

                    <TableRow className="font-medium">
                      <TableCell colSpan={2} className="text-right">Total:</TableCell>
                      <TableCell className="text-right">${state.calculatedAllowances.total.toFixed(2)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Payment and FBT */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Payment Details */}
              <div>
                <h3 className="text-base font-medium flex items-center mb-2">
                  <BadgeDollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                  Payment Details
                </h3>
                <div className="rounded-md border">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium text-muted-foreground">Payment Via</TableCell>
                        <TableCell>
                          {state.paymentVia === "payroll" ? "Payroll" : 
                           state.paymentVia === "reimbursement" ? "Reimbursement" : "Not specified"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-muted-foreground">Advance Required</TableCell>
                        <TableCell>{state.advancePaymentRequired ? "Yes" : "No"}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-muted-foreground">Receipts Required</TableCell>
                        <TableCell>{state.receiptRequired ? "Yes" : "No"}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* FBT Details */}
              <div>
                <h3 className="text-base font-medium flex items-center mb-2">
                  <BadgePercent className="h-4 w-4 mr-2 text-muted-foreground" />
                  FBT & Compliance
                </h3>
                <div className="rounded-md border">
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium text-muted-foreground">FBT Applicable</TableCell>
                        <TableCell className="flex items-center gap-2">
                          {state.calculatedAllowances.fbtApplicable ? "Yes" : "No"}
                          {state.calculatedAllowances.fbtApplicable && (
                            <Badge variant="outline">Reportable benefit</Badge>
                          )}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-muted-foreground">Tax Treatment</TableCell>
                        <TableCell>
                          {state.travelType === "short_stay" ? "Standard withholding" : 
                           state.travelType === "long_stay" ? "Concessional treatment" :
                           "Reportable payment"}
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium text-muted-foreground">Post-Travel Review</TableCell>
                        <TableCell>
                          {state.travelType === "short_stay" ? "Not required" : "Required"}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Approval Routing</CardTitle>
          <CardDescription>
            Your request will be sent to your line manager for approval.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 p-4 bg-primary/5 rounded-md">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">Jane Smith</h3>
              <p className="text-sm text-muted-foreground">
                Department Manager (Auto-assigned)
              </p>
            </div>
          </div>

          <div className="mt-4 p-4 border rounded-md space-y-4">
            <h3 className="text-sm font-medium">Delegate Approver (Optional)</h3>
            <p className="text-sm text-muted-foreground">
              If your line manager is unavailable, you can specify a delegate approver.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="delegate-name">Delegate Name</Label>
                <Input
                  id="delegate-name"
                  placeholder="Full name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delegate-email">Delegate Email</Label>
                <Input
                  id="delegate-email"
                  placeholder="Work email address"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Additional Information</CardTitle>
          <CardDescription>
            Add any relevant notes or upload additional documents.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="additional-notes">Additional Notes</Label>
              <Textarea
                id="additional-notes"
                placeholder="Any additional information that may be relevant to this request..."
                className="min-h-[120px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Supporting Documents</Label>
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center">
                <div className="mb-3">
                  <FileUp className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload any supporting documents such as conference invitations, 
                  meeting agendas, or project plans.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleAttachmentUpload}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Select Files
                </Button>
              </div>

              {state.attachments.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Uploaded Files</h3>
                  <div className="space-y-2">
                    {state.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center mr-3">
                            <FileUp className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{attachment.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(attachment.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveAttachment(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Post-Travel Workflow</CardTitle>
          <CardDescription>
            After your trip, you may need to update your details.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm">
              A post-travel workflow will be triggered automatically if any of these apply:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <Pencil className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Date Changes</h3>
                  <p className="text-sm text-muted-foreground">
                    If your actual travel dates differ from planned dates
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <TimerReset className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Trip Extension</h3>
                  <p className="text-sm text-muted-foreground">
                    If your trip is extended to 21+ days
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="mt-0.5">
                  <CircleCheck className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="text-sm font-medium">Meal Declaration Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    If you need to update provided meal information
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700 flex">
              <Info className="h-5 w-5 mr-2 flex-shrink-0 text-blue-500" />
              <p>
                If your trip was completed without any changes, no further action will be required.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="pt-4">
        <div className="flex items-start space-x-2">
          <Checkbox
            id="declaration"
            checked={state.declaration}
            onCheckedChange={handleDeclarationChange}
          />
          <div>
            <Label 
              htmlFor="declaration" 
              className={`text-base ${hasError("declaration") ? "text-destructive" : ""}`}
            >
              Declaration
            </Label>
            <p className="text-sm text-muted-foreground">
              I declare that all information provided is true and correct. I understand that providing false or 
              misleading information may result in disciplinary action. I agree to notify the travel team of any 
              changes to my travel arrangements.
            </p>
            {hasError("declaration") && (
              <p className="text-destructive text-sm mt-1">
                {state.errors.declaration}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 bg-muted/30 text-center rounded-md text-sm">
        <p>
          <span className="text-muted-foreground">Form version:</span>{" "}
          <span className="font-semibold">Travel & LAFHA Request Form v1.0 - April 2025</span>
        </p>
      </div>
    </div>
  );
};

export default ApprovalSubmission;
