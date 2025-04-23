
import React, { useState } from "react";
import { useForm } from "@/context/FormContext";
import { v4 as uuidv4 } from "uuid";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2 } from "lucide-react";

const TravelerSetup = () => {
  const { state, dispatch } = useForm();
  const [newTraveler, setNewTraveler] = useState({
    name: "",
    employeeId: "",
    mobileNumber: "",
    role: "",
  });

  // Handle booking type change
  const handleBookingTypeChange = (value: string) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "bookingFor",
      value,
    });
  };

  // Handle new traveler input change
  const handleTravelerInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setNewTraveler({
      ...newTraveler,
      [field]: e.target.value,
    });
  };

  // Add new traveler
  const addTraveler = () => {
    const traveler = {
      id: uuidv4(),
      ...newTraveler,
    };

    dispatch({
      type: "ADD_TRAVELER",
      traveler,
    });

    // Clear the form
    setNewTraveler({
      name: "",
      employeeId: "",
      mobileNumber: "",
      role: "",
    });
  };

  // Remove traveler
  const removeTraveler = (id: string) => {
    dispatch({
      type: "REMOVE_TRAVELER",
      id,
    });
  };

  // Check if all required fields are filled for new traveler
  const isTravelerFormValid = () => {
    return (
      newTraveler.name &&
      newTraveler.employeeId &&
      newTraveler.mobileNumber &&
      newTraveler.role
    );
  };

  // Determine if error exists for a field
  const hasError = (field: string) => {
    return Boolean(state.errors[field]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Traveler Setup</h2>
        <p className="text-gray-500">
          Please provide details about who is traveling.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label
            htmlFor="booking-type"
            className={hasError("bookingFor") ? "text-destructive" : ""}
          >
            Who is this booking for?
          </Label>
          <RadioGroup
            id="booking-type"
            value={state.bookingFor}
            onValueChange={handleBookingTypeChange}
            className="flex flex-col space-y-1"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="myself" id="booking-myself" />
              <Label htmlFor="booking-myself">Myself</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="someone_else" id="booking-someone" />
              <Label htmlFor="booking-someone">Someone else</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="group" id="booking-group" />
              <Label htmlFor="booking-group">A group</Label>
            </div>
          </RadioGroup>
          {hasError("bookingFor") && (
            <p className="text-destructive text-sm mt-1">
              {state.errors.bookingFor}
            </p>
          )}
        </div>

        {/* Show traveler table for "someone else" or "group" */}
        {(state.bookingFor === "someone_else" || state.bookingFor === "group") && (
          <Card>
            <CardHeader>
              <CardTitle>
                {state.bookingFor === "someone_else"
                  ? "Traveler Details"
                  : "Group Details"}
              </CardTitle>
              <CardDescription>
                {state.bookingFor === "someone_else"
                  ? "Enter details for the person traveling."
                  : "Enter details for each person in the group."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Form to add new traveler */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="traveler-name">Name</Label>
                    <Input
                      id="traveler-name"
                      value={newTraveler.name}
                      onChange={(e) => handleTravelerInputChange(e, "name")}
                      placeholder="Full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="traveler-employee-id">Employee ID</Label>
                    <Input
                      id="traveler-employee-id"
                      value={newTraveler.employeeId}
                      onChange={(e) => handleTravelerInputChange(e, "employeeId")}
                      placeholder="Employee ID"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="traveler-mobile">Mobile Number</Label>
                    <Input
                      id="traveler-mobile"
                      value={newTraveler.mobileNumber}
                      onChange={(e) =>
                        handleTravelerInputChange(e, "mobileNumber")
                      }
                      placeholder="Mobile number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="traveler-role">Role</Label>
                    <Input
                      id="traveler-role"
                      value={newTraveler.role}
                      onChange={(e) => handleTravelerInputChange(e, "role")}
                      placeholder="Job role"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={addTraveler}
                    disabled={!isTravelerFormValid()}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add {state.bookingFor === "group" ? "Person" : "Traveler"}
                  </Button>
                </div>

                {/* Error message if no travelers added */}
                {hasError("travelers") && (
                  <p className="text-destructive text-sm mt-1">
                    {state.errors.travelers}
                  </p>
                )}

                {/* Display added travelers */}
                {state.travelers.length > 0 && (
                  <div className="mt-4 border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Employee ID</TableHead>
                          <TableHead>Mobile Number</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {state.travelers.map((traveler) => (
                          <TableRow key={traveler.id}>
                            <TableCell>{traveler.name}</TableCell>
                            <TableCell>{traveler.employeeId}</TableCell>
                            <TableCell>{traveler.mobileNumber}</TableCell>
                            <TableCell>{traveler.role}</TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeTraveler(traveler.id)}
                                className="text-destructive hover:text-destructive/90"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Show current user details for "myself" */}
        {state.bookingFor === "myself" && (
          <Card>
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
              <CardDescription>
                These details are pre-filled from your employee profile.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value="John Doe" // Example value, would be pulled from user context
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Employee ID</Label>
                  <Input
                    value="EMP12345" // Example value
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <Input
                    value="+61 123 456 789" // Example value
                    disabled
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Role</Label>
                  <Input
                    value="Senior Engineer" // Example value
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TravelerSetup;
