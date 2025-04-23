
import React from "react";
import { useForm } from "@/context/FormContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  CircleDollarSign,
  Clock,
  FileUp,
  Info,
  Trash2,
  Upload,
} from "lucide-react";

const PaymentOptions = () => {
  const { state, dispatch } = useForm();
  
  // Create file input reference
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Handle payment method change
  const handlePaymentMethodChange = (value: string) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "paymentVia",
      value,
    });
  };

  // Handle advance payment toggle
  const handleAdvancePaymentToggle = (checked: boolean) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "advancePaymentRequired",
      value: checked,
    });
  };

  // Handle payroll deduction toggle
  const handlePayrollDeductionToggle = (checked: boolean) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "authorizePayrollDeduction",
      value: checked,
    });
  };

  // Handle receipt upload
  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length >0) {
      Array.from(e.target.files).forEach(file => {
        dispatch({
          type: "ADD_RECEIPT",
          file,
        });
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle receipt removal
  const handleRemoveReceipt = (index: number) => {
    dispatch({
      type: "REMOVE_RECEIPT",
      index,
    });
  };

  // Determine if field has error
  const hasError = (field: string) => {
    return Boolean(state.errors[field]);
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Payment Options</h2>
        <p className="text-gray-500">
          Select how you would like to receive payment for this trip.
        </p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Advance Payment</CardTitle>
                <CardDescription>
                  Request payment before travel
                </CardDescription>
              </div>
              <Switch
                checked={state.advancePaymentRequired}
                onCheckedChange={handleAdvancePaymentToggle}
              />
            </div>
          </CardHeader>
          {state.advancePaymentRequired && (
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="authorize-payroll-deduction"
                    checked={state.authorizePayrollDeduction}
                    onCheckedChange={handlePayrollDeductionToggle}
                  />
                  <div>
                    <Label 
                      htmlFor="authorize-payroll-deduction"
                      className={hasError("authorizePayrollDeduction") ? "text-destructive" : ""}
                    >
                      I authorize payroll deduction for any overpayments
                    </Label>
                    {hasError("authorizePayrollDeduction") && (
                      <p className="text-destructive text-sm mt-1">
                        {state.errors.authorizePayrollDeduction}
                      </p>
                    )}
                  </div>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700 flex">
                  <Info className="h-5 w-5 mr-2 flex-shrink-0 text-blue-500" />
                  <p>
                    Advance payments are processed 5 business days prior to departure.
                    Changes to your trip details may result in adjustments to your 
                    allowance either before travel or via payroll deduction after travel.
                  </p>
                </div>
              </div>
            </CardContent>
          )}
        </Card>

        <div className="space-y-2">
          <Label 
            htmlFor="payment-method"
            className={hasError("paymentVia") ? "text-destructive" : ""}
          >
            Payment Method
          </Label>
          <Select
            value={state.paymentVia}
            onValueChange={handlePaymentMethodChange}
          >
            <SelectTrigger 
              id="payment-method"
              className={hasError("paymentVia") ? "border-destructive" : ""}
            >
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="payroll">Via Payroll (next pay cycle)</SelectItem>
              <SelectItem value="reimbursement">Post-travel Reimbursement</SelectItem>
            </SelectContent>
          </Select>
          {hasError("paymentVia") && (
            <p className="text-destructive text-sm mt-1">
              {state.errors.paymentVia}
            </p>
          )}

          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border rounded-md flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <CircleDollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Via Payroll</h3>
                <p className="text-sm text-muted-foreground">
                  Paid in your next pay cycle
                </p>
              </div>
            </div>

            <div className="p-4 border rounded-md flex items-center">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">Post-travel Reimbursement</h3>
                <p className="text-sm text-muted-foreground">
                  Submit expenses after your trip
                </p>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Upload Receipts</CardTitle>
            <CardDescription>
              {state.receiptRequired 
                ? "Receipt upload is required for this claim." 
                : "Upload receipts if you have any."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.receiptRequired && (
              <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-md text-sm text-amber-700 flex">
                <Info className="h-5 w-5 mr-2 flex-shrink-0 text-amber-500" />
                <div>
                  <p className="font-medium">Receipts are required because:</p>
                  <ul className="list-disc ml-5 mt-1">
                    {state.accommodationType === "self_booked" && (
                      <li>You selected self-booked accommodation</li>
                    )}
                    {state.calculatedAllowances.total > 300 && (
                      <li>Your claim exceeds the ATO threshold</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 text-center">
                <div className="mb-3">
                  <FileUp className="h-10 w-10 text-muted-foreground" />
                </div>
                <h3 className="font-medium mb-1">
                  Drag and drop files or click to upload
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Supported formats: PDF, JPEG, PNG (max 10MB)
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                  multiple
                  onChange={handleReceiptUpload}
                />
                <Button 
                  variant="outline" 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Select Files
                </Button>
              </div>

              {state.receipts.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">Uploaded Receipts</h3>
                  <div className="space-y-2">
                    {state.receipts.map((receipt, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded-md"
                      >
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center mr-3">
                            <FileUp className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{receipt.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatFileSize(receipt.size)}
                            </p>
                          </div>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => handleRemoveReceipt(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {state.receiptRequired && hasError("receipts") && (
                <p className="text-destructive text-sm">
                  {state.errors.receipts}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PaymentOptions;
