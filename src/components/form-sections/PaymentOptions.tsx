
import React from "react";
import { useForm } from "@/context/FormContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  AlertCircle,
  AlertTriangle,
  HelpCircle,
  Upload,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";

const PaymentOptions = () => {
  const { state, dispatch } = useForm();
  
  // Handle payment via selection
  const handlePaymentViaChange = (value: string) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "paymentVia",
      value,
    });
  };
  
  // Handle advance payment toggle
  const handleAdvancePaymentChange = (checked: boolean) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "advancePaymentRequired",
      value: checked,
    });
    
    // If advance payment is toggled off, toggle off payroll deduction authorization
    if (!checked) {
      dispatch({
        type: "UPDATE_FIELD",
        field: "authorizePayrollDeduction",
        value: false,
      });
    }
  };
  
  // Handle payroll deduction toggle
  const handlePayrollDeductionChange = (checked: boolean) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "authorizePayrollDeduction",
      value: checked,
    });
  };
  
  // Handle receipt file selection
  const handleReceiptFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Add each file to receipts array
      for (let i = 0; i < e.target.files.length; i++) {
        dispatch({
          type: "ADD_RECEIPT",
          file: e.target.files[i],
        });
      }
      
      // Reset file input
      e.target.value = "";
    }
  };
  
  // Handle removal of receipt file
  const handleRemoveReceipt = (index: number) => {
    dispatch({
      type: "REMOVE_RECEIPT",
      index,
    });
  };
  
  // Determine if a field has an error
  const hasError = (field: string) => {
    return Boolean(state.errors[field]);
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Payment Details</h2>
        <p className="text-gray-500">
          Specify how you would like to receive your travel allowance.
        </p>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Payment Method</CardTitle>
          <CardDescription>
            Choose how you want to receive your allowance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <RadioGroup
            value={state.paymentVia}
            onValueChange={handlePaymentViaChange}
            className={hasError("paymentVia") ? "border border-destructive p-3 rounded-md" : ""}
          >
            <div className="flex items-start space-x-2 mb-4">
              <RadioGroupItem value="payroll" id="payroll" />
              <div className="grid gap-1.5">
                <Label htmlFor="payroll">Payroll</Label>
                <p className="text-sm text-muted-foreground">
                  Allowance will be paid through payroll with your regular pay.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <RadioGroupItem value="reimbursement" id="reimbursement" />
              <div className="grid gap-1.5">
                <Label htmlFor="reimbursement">Expense Reimbursement</Label>
                <p className="text-sm text-muted-foreground">
                  Submit expenses for reimbursement after the trip.
                </p>
              </div>
            </div>
          </RadioGroup>
          
          {hasError("paymentVia") && (
            <p className="text-destructive text-sm">
              {state.errors.paymentVia}
            </p>
          )}
          
          <div className="pt-4 border-t">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="advance-payment"
                checked={state.advancePaymentRequired}
                onCheckedChange={handleAdvancePaymentChange}
                disabled={state.paymentVia !== "payroll"}
              />
              <div>
                <Label 
                  htmlFor="advance-payment"
                  className={state.paymentVia !== "payroll" ? "text-muted-foreground" : ""}
                >
                  Request Advance Payment
                </Label>
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Advance payments are only available through payroll and must be requested at least 7 days before travel.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            {state.advancePaymentRequired && (
              <div className="mt-4 pl-6">
                <div className="p-3 border border-yellow-200 bg-yellow-50 rounded-md">
                  <div className="flex gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0" />
                    <div className="space-y-2">
                      <p className="text-sm text-yellow-800">
                        By requesting an advance payment, you agree to:
                      </p>
                      <div className="flex items-start space-x-2">
                        <Checkbox 
                          id="authorize-deduction"
                          checked={state.authorizePayrollDeduction}
                          onCheckedChange={handlePayrollDeductionChange}
                        />
                        <Label className="text-sm text-yellow-800" htmlFor="authorize-deduction">
                          I authorise payroll to recover any overpayment from my next pay if my travel circumstances change.
                        </Label>
                      </div>
                      {hasError("authorizePayrollDeduction") && (
                        <p className="text-destructive text-sm">
                          {state.errors.authorizePayrollDeduction}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {state.receiptRequired && (
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-medium">Receipts Required</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your claim requires supporting documentation. Please upload after travel completion.
                  </p>
                </div>
              </div>
              
              {state.accommodationType === "self_booked" && (
                <div className="flex items-start gap-2">
                  <Badge variant="outline" className="mt-0.5">Self-booked</Badge>
                  <p className="text-sm">
                    Self-booked accommodation requires receipts for reimbursement after travel.
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="p-4 border border-blue-100 bg-blue-50 rounded-md">
        <div className="flex gap-2">
          <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-800">
            If your trip changes, payroll will recalculate entitlements after travel and recover overpayments if needed.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentOptions;
