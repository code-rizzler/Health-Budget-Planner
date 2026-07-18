import { useState } from "react";
import { useGetMealPlan, useGenerateMealPlan } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { Link, useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";
import { Clock, Flame, Beef, Wheat, Droplets, ChevronRight } from "lucide-react";

type MealDetail = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  cookingTime: number;
  recipeId: number | null;
};

type SelectedMeal = {
  label: string;
  meal: MealDetail;
};

function MacroPill({ icon: Icon, label, value, unit }: { icon: React.ElementType; label: string; value: number; unit: string }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-secondary/60 rounded-xl p-3 flex-1">
      <Icon className="h-4 w-4 text-primary" />
      <span className="text-lg font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{unit} {label}</span>
    </div>
  );
}

export function MealPlan() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [selected, setSelected] = useState<SelectedMeal | null>(null);

  const { data: mealPlan, isLoading } = useGetMealPlan({
    query: { queryKey: ["mealPlan"] }
  });

  const generatePlan = useGenerateMealPlan();

  const handleGenerate = () => {
    generatePlan.mutate(undefined, {
      onSuccess: () => {
        toast({ title: "Meal Plan Generated", description: "Your 30-day personalized plan is ready." });
        queryClient.invalidateQueries({ queryKey: ["mealPlan"] });
        queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to generate plan.", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!mealPlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">No Meal Plan Found</h2>
        <p className="text-muted-foreground mb-8">
          Generate a 30-day personalized meal plan based on your dietary preferences, allergies, and goals.
        </p>
        <Button size="lg" onClick={handleGenerate} disabled={generatePlan.isPending}>
          {generatePlan.isPending ? "Generating..." : "Generate 30-Day Plan"}
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Meal Plan</h1>
            <p className="text-muted-foreground mt-1">Generated on {format(parseISO(mealPlan.generatedAt), "MMM d, yyyy")}</p>
          </div>
          <Button variant="outline" onClick={handleGenerate} disabled={generatePlan.isPending}>
            {generatePlan.isPending ? "Regenerating..." : "Regenerate Plan"}
          </Button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {mealPlan.days.slice(0, 14).map((day, idx) => (
            <motion.div
              key={day.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <Card className="glass-card h-full">
                <CardHeader className="pb-3 border-b border-border/50">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">Day {day.day} - {format(parseISO(day.date), "MMM d")}</CardTitle>
                    <div className="text-sm font-medium text-primary bg-primary/10 px-2 py-1 rounded-md">
                      {day.totalCalories} kcal
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4 space-y-1">
                  {[
                    { label: "Breakfast", meal: day.breakfast },
                    { label: "Lunch", meal: day.lunch },
                    { label: "Dinner", meal: day.dinner },
                  ].map(({ label, meal }) => (
                    <button
                      key={label}
                      onClick={() => setSelected({ label, meal })}
                      className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group text-left"
                    >
                      <div>
                        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                        <p className="font-medium group-hover:text-primary transition-colors">{meal.name}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-sm text-right text-muted-foreground">
                          <p>{meal.calories} kcal</p>
                          <p className="text-xs">{meal.cookingTime}m</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        <div className="text-center p-8">
          <p className="text-muted-foreground">Showing next 14 days of your 30 day plan.</p>
        </div>
      </div>

      {/* Meal detail sheet */}
      <Sheet open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <SheetContent className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader className="mb-6">
                <p className="text-xs font-medium text-primary uppercase tracking-wider">{selected.label}</p>
                <SheetTitle className="text-2xl leading-snug">{selected.meal.name}</SheetTitle>
              </SheetHeader>

              <div className="space-y-6">
                {/* Macros */}
                <div className="flex gap-3">
                  <MacroPill icon={Flame}   label="Calories" value={selected.meal.calories}  unit="kcal" />
                  <MacroPill icon={Beef}    label="Protein"  value={selected.meal.protein}    unit="g" />
                  <MacroPill icon={Wheat}   label="Carbs"    value={selected.meal.carbs}      unit="g" />
                  <MacroPill icon={Droplets} label="Fat"     value={selected.meal.fat}        unit="g" />
                </div>

                {/* Cooking time */}
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Clock className="h-4 w-4" />
                  <span>{selected.meal.cookingTime} min prep time</span>
                </div>

                {/* Recipe CTA */}
                {selected.meal.recipeId ? (
                  <Button
                    className="w-full"
                    onClick={() => {
                      navigate(`/recipes/${selected.meal.recipeId}`);
                      setSelected(null);
                    }}
                  >
                    View Full Recipe
                  </Button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      No dedicated recipe page for this meal yet. Browse the recipe library for similar dishes.
                    </p>
                    <Link href="/recipes">
                      <Button variant="outline" className="w-full" onClick={() => setSelected(null)}>
                        Browse Recipes
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
