import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUpsertProfile } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

const profileSchema = z.object({
  age: z.coerce.number().min(18).max(100),
  gender: z.string().min(1),
  height: z.coerce.number().min(100).max(250), // cm
  weight: z.coerce.number().min(30).max(200), // kg
  activityLevel: z.string().min(1),
  goal: z.string().min(1),
  dietPreference: z.string().min(1),
  foodAllergies: z.string().optional(),
  monthlyBudget: z.coerce.number().min(1000).max(100000),
  city: z.string().min(1),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export function Onboarding() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const upsertProfile = useUpsertProfile();
  
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      age: 30,
      gender: "Male",
      height: 170,
      weight: 70,
      activityLevel: "Moderate",
      goal: "Maintenance",
      dietPreference: "Veg",
      foodAllergies: "",
      monthlyBudget: 15000,
      city: "Mumbai",
    },
  });

  const onSubmit = (data: ProfileFormValues) => {
    upsertProfile.mutate(
      { data },
      {
        onSuccess: () => {
          toast({ title: "Profile saved!", description: "Welcome to BudgetBite." });
          setLocation("/dashboard");
        },
        onError: () => {
          toast({ title: "Error", description: "Failed to save profile.", variant: "destructive" });
        }
      }
    );
  };

  const nextStep = () => {
    const fieldsToValidate = getFieldsForStep(step);
    form.trigger(fieldsToValidate).then((isValid) => {
      if (isValid) setStep((s) => Math.min(s + 1, totalSteps));
    });
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const getFieldsForStep = (currentStep: number): (keyof ProfileFormValues)[] => {
    switch (currentStep) {
      case 1: return ["age", "gender", "height", "weight"];
      case 2: return ["activityLevel", "goal"];
      case 3: return ["dietPreference", "foodAllergies"];
      case 4: return ["monthlyBudget", "city"];
      default: return [];
    }
  };

  return (
    <div className="min-h-screen bg-background/50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Let's personalize your plan</h1>
          <p className="text-muted-foreground">Tell us a bit about yourself</p>
        </div>
        
        <Progress value={(step / totalSteps) * 100} className="mb-6 h-2" />

        <Card className="glass-card">
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age</FormLabel>
                              <FormControl><Input type="number" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="gender"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Gender</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                                <SelectContent>
                                  <SelectItem value="Male">Male</SelectItem>
                                  <SelectItem value="Female">Female</SelectItem>
                                  <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="height"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Height (cm)</FormLabel>
                              <FormControl><Input type="number" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="weight"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Weight (kg)</FormLabel>
                              <FormControl><Input type="number" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h2 className="text-xl font-semibold mb-4">Lifestyle & Goals</h2>
                      <FormField
                        control={form.control}
                        name="activityLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Activity Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="Sedentary">Sedentary</SelectItem>
                                <SelectItem value="Light">Light</SelectItem>
                                <SelectItem value="Moderate">Moderate</SelectItem>
                                <SelectItem value="Active">Active</SelectItem>
                                <SelectItem value="Very Active">Very Active</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="goal"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Primary Goal</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="Weight Loss">Weight Loss</SelectItem>
                                <SelectItem value="Maintenance">Maintenance</SelectItem>
                                <SelectItem value="Muscle Gain">Muscle Gain</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h2 className="text-xl font-semibold mb-4">Diet & Preferences</h2>
                      <FormField
                        control={form.control}
                        name="dietPreference"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Diet Type</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger></FormControl>
                              <SelectContent>
                                <SelectItem value="Veg">Vegetarian</SelectItem>
                                <SelectItem value="Eggitarian">Eggitarian</SelectItem>
                                <SelectItem value="Non-Veg">Non-Vegetarian</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="foodAllergies"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Food Allergies (Optional)</FormLabel>
                            <FormControl><Input placeholder="e.g. Peanuts, Dairy" {...field} value={field.value || ""} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}

                  {step === 4 && (
                    <motion.div
                      key="step4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h2 className="text-xl font-semibold mb-4">Budget & Location</h2>
                      <FormField
                        control={form.control}
                        name="monthlyBudget"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Monthly Grocery Budget (₹)</FormLabel>
                            <FormControl><Input type="number" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl><Input placeholder="e.g. Mumbai, Delhi" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex justify-between pt-4">
                  {step > 1 ? (
                    <Button type="button" variant="outline" onClick={prevStep}>Back</Button>
                  ) : <div></div>}
                  
                  {step < totalSteps ? (
                    <Button type="button" onClick={nextStep}>Continue</Button>
                  ) : (
                    <Button type="submit" disabled={upsertProfile.isPending}>
                      {upsertProfile.isPending ? "Saving..." : "Complete Setup"}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
