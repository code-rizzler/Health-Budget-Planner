import { useGetProfile, useGetDashboardSummary, useGetTodayMeals } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { useLocation, Link } from "wouter";
import { useUser } from "@clerk/react";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Activity, Utensils, Wallet, ShoppingCart } from "lucide-react";

export function Dashboard() {
  const { user } = useUser();
  const [, setLocation] = useLocation();

  const { data: profile, isLoading: profileLoading, error: profileError } = useGetProfile({
    query: {
      enabled: !!user,
      queryKey: ["profile"],
      retry: false,
    }
  });

  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary({
    query: {
      enabled: !!profile,
      queryKey: ["dashboardSummary"],
    }
  });

  const { data: todayMeals, isLoading: mealsLoading } = useGetTodayMeals({
    query: {
      enabled: !!profile && summary?.mealPlanGenerated,
      queryKey: ["todayMeals"],
    }
  });

  useEffect(() => {
    // If we 404 on profile, they need to onboard
    if (profileError) {
      setLocation("/onboarding");
    }
  }, [profileError, setLocation]);

  if (profileLoading || !profile) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Welcome back, {user?.firstName || "Friend"}
          </h1>
          <p className="text-muted-foreground mt-1">Here is your daily snapshot.</p>
        </div>
        <div className="flex gap-3">
          {!summary?.mealPlanGenerated && (
            <Button asChild variant="outline">
              <Link href="/meal-plan">Generate Meal Plan</Link>
            </Button>
          )}
          {!summary?.groceryPlanGenerated && (
            <Button asChild>
              <Link href="/grocery">Plan Groceries</Link>
            </Button>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Today's Calories</p>
              <h3 className="text-3xl font-bold mt-1">
                {summaryLoading ? "-" : summary?.todayCalories || 0}
                <span className="text-lg text-muted-foreground font-normal ml-1">kcal</span>
              </h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl">
              <Activity className="h-5 w-5 text-primary" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Protein</span>
              <span className="font-medium">{summary?.todayProtein || 0}g</span>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Budget Remaining</p>
              <h3 className="text-3xl font-bold mt-1 text-accent">
                {summaryLoading ? "-" : `₹${summary?.budgetRemaining || 0}`}
              </h3>
            </div>
            <div className="p-3 bg-accent/10 rounded-xl">
              <Wallet className="h-5 w-5 text-accent" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Spent</span>
              <span className="font-medium">₹{summary?.budgetSpent || 0}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div 
                className="bg-accent h-full rounded-full transition-all" 
                style={{ width: `${Math.min(((summary?.budgetSpent || 0) / (summary?.monthlyBudget || 1)) * 100, 100)}%` }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6 flex flex-col justify-between"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Groceries Needed</p>
              <h3 className="text-3xl font-bold mt-1">
                {summaryLoading ? "-" : summary?.groceryItemsCount || 0}
                <span className="text-lg text-muted-foreground font-normal ml-1">items</span>
              </h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-xl">
              <ShoppingCart className="h-5 w-5 text-primary" />
            </div>
          </div>
          <Button variant="link" className="p-0 h-auto justify-start text-primary" asChild>
            <Link href="/grocery">View Shopping List &rarr;</Link>
          </Button>
        </motion.div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Today's Meals</h2>
        
        {mealsLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
            <Skeleton className="h-24 rounded-xl" />
          </div>
        ) : !todayMeals ? (
          <Card className="glass-card border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Utensils className="h-12 w-12 text-muted-foreground mb-4 opacity-20" />
              <p className="text-muted-foreground mb-4">No meals planned for today.</p>
              <Button asChild><Link href="/meal-plan">Create Meal Plan</Link></Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { type: 'Breakfast', meal: todayMeals.breakfast },
              { type: 'Lunch', meal: todayMeals.lunch },
              { type: 'Dinner', meal: todayMeals.dinner }
            ].map(({ type, meal }, idx) => (
              <motion.div
                key={type}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
              >
                <Link href={meal.recipeId ? `/recipes/${meal.recipeId}` : "/recipes"}>
                  <Card className="glass-card hover:bg-card/60 transition-colors cursor-pointer group h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex justify-between">
                        <span>{type}</span>
                        <span className="text-sm font-normal text-muted-foreground bg-secondary px-2 py-1 rounded-md">
                          {meal.calories} kcal
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="font-medium group-hover:text-primary transition-colors">{meal.name}</p>
                      <div className="flex gap-3 text-sm text-muted-foreground mt-3">
                        <span>P: {meal.protein}g</span>
                        <span>C: {meal.carbs}g</span>
                        <span>F: {meal.fat}g</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
