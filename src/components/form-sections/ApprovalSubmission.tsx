
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  CircleCheck,
  FileUp,
  Info,
  Pencil,
  TimerReset,
  Trash2,
  Upload,
  UserCheck,
} from "lucide-react";

const ApprovalSubmission = () => {
  const { state, dispatch } = useForm();
  
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

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Approval & Submission</h2>
        <p className="text-gray-500">
          Review your request and submit for approval.
        </p>
      </div>

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
