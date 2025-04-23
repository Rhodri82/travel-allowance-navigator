
import React from "react";
import { useForm } from "@/context/FormContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  AlertTriangle,
  Clock,
  HelpCircle,
  MapPin,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { MealType } from "@/context/FormContext";
import { isBreakfastEligible } from "@/utils/calculationUtils";

const MealsSection = () => {
  const { state, dispatch } = useForm();

  // Check if meals are eligible based on trip duration and distance
  const mealsEligible = state.eligibleForMeals;

  // Check if breakfast is eligible based on early departure
  const breakfastEligible = state.breakfastEligible;

  // Handle meals provided toggle
  const handleMealsProvidedToggle = (checked: boolean) => {
    dispatch({
      type: "UPDATE_FIELD",
      field: "mealsProvided",
      value: checked,
    });

    // Clear provided meals if toggled off
    if (!checked) {
      dispatch({
        type: "UPDATE_FIELD",
        field: "providedMeals",
        value: [],
      });
    }
  };

  // Handle meal selection checkbox
  const handleMealSelection = (checked: boolean, meal: MealType) => {
    if (checked) {
      dispatch({
        type: "UPDATE_FIELD",
        field: "providedMeals",
        value: [...state.providedMeals, meal],
      });
    } else {
      dispatch({
        type: "UPDATE_FIELD",
        field: "providedMeals",
        value: state.providedMeals.filter((m) => m !== meal),
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Meals Allowance</h2>
        <p className="text-gray-500">
          Declare any provided meals during your trip.
        </p>
      </div>

      {!mealsEligible ? (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Meals Allowance Not Applicable</CardTitle>
            <CardDescription>
              Your trip does not meet the criteria for meals allowance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <p>Trips must be over 10 hours in duration</p>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <p>Must be greater than 50km from usual work location</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Were any meals provided?</CardTitle>
                  <CardDescription>
                    E.g., by the conference, hotel, or client
                  </CardDescription>
                </div>
                <Switch
                  checked={state.mealsProvided}
                  onCheckedChange={handleMealsProvidedToggle}
                />
              </div>
            </CardHeader>
            {state.mealsProvided && (
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="meal-breakfast"
                        checked={state.providedMeals.includes("breakfast")}
                        onCheckedChange={(checked) =>
                          handleMealSelection(checked as boolean, "breakfast")
                        }
                        disabled={!breakfastEligible}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <Label 
                            htmlFor="meal-breakfast" 
                            className={!breakfastEligible ? "text-muted-foreground" : ""}
                          >
                            Breakfast
                          </Label>
                          {!breakfastEligible && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger>
                                  <HelpCircle className="h-4 w-4 text-muted-foreground ml-1" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p className="w-[220px]">
                                    Breakfast allowance only eligible if departure is ≥ 2 hours 
                                    before usual start time per EA guidelines.
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                        {!breakfastEligible && (
                          <p className="text-xs text-muted-foreground">
                            Not eligible based on departure time
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="meal-lunch"
                        checked={state.providedMeals.includes("lunch")}
                        onCheckedChange={(checked) =>
                          handleMealSelection(checked as boolean, "lunch")
                        }
                      />
                      <Label htmlFor="meal-lunch">Lunch</Label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="meal-dinner"
                        checked={state.providedMeals.includes("dinner")}
                        onCheckedChange={(checked) =>
                          handleMealSelection(checked as boolean, "dinner")
                        }
                      />
                      <Label htmlFor="meal-dinner">Dinner</Label>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50 border border-blue-100 rounded-md text-sm text-blue-700">
                    <p>
                      Only select meals that were provided during your travel. 
                      Meals you pay for yourself will be covered by your allowance.
                    </p>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          <Card className="bg-muted/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Meals Allowance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-muted-foreground">Daily allowance:</span>
                    <p className="font-medium">$75.00</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Eligible days:</span>
                    <p className="font-medium">{state.consecutiveNights + 1} days</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div className="text-sm text-amber-700">
                    <p className="font-medium">Declaration Required</p>
                    <p>
                      You must declare any meals provided during your travel. 
                      Undeclared meals may result in FBT implications.
                    </p>
                  </div>
                </div>

                {state.mealsProvided && state.providedMeals.length > 0 && (
                  <div className="p-3 bg-muted rounded-md">
                    <p className="text-sm font-medium">Provided Meals Summary:</p>
                    <ul className="list-disc ml-5 mt-1 text-sm">
                      {state.providedMeals.includes("breakfast") && <li>Breakfast</li>}
                      {state.providedMeals.includes("lunch") && <li>Lunch</li>}
                      {state.providedMeals.includes("dinner") && <li>Dinner</li>}
                    </ul>
                    <p className="text-sm mt-2">
                      These will be deducted from your allowance ($25 per meal).
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default MealsSection;
