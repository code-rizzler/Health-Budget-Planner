import { useGetGroceryPlan, useGenerateGroceryPlan } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

export function Grocery() {
  const { toast } = useToast();
  const { data: plan, isLoading } = useGetGroceryPlan({
    query: { queryKey: ["groceryPlan"] }
  });

  const generatePlan = useGenerateGroceryPlan();

  const handleGenerate = () => {
    generatePlan.mutate(undefined, {
      onSuccess: () => {
        toast({ title: "Grocery List Generated", description: "Your shopping list is ready." });
        queryClient.invalidateQueries({ queryKey: ["groceryPlan"] });
        queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      },
      onError: () => {
        toast({ title: "Error", description: "Failed to generate list.", variant: "destructive" });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-32 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">No Grocery Plan</h2>
        <p className="text-muted-foreground mb-8">
          Generate an AI-optimized grocery list based on your 30-day meal plan and budget.
        </p>
        <Button size="lg" onClick={handleGenerate} disabled={generatePlan.isPending}>
          {generatePlan.isPending ? "Generating..." : "Generate Grocery List"}
        </Button>
      </div>
    );
  }

  // Group items by category
  const groupedItems = (plan.items ?? []).reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof plan.items>);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Grocery List</h1>
          <p className="text-muted-foreground mt-1">Smart shopping tailored to your meals.</p>
        </div>
        <Button variant="outline" onClick={handleGenerate} disabled={generatePlan.isPending}>
          {generatePlan.isPending ? "Updating..." : "Update List"}
        </Button>
      </div>

      <Card className="glass-card bg-primary/5 border-primary/20">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Estimated Total</p>
            <h2 className="text-3xl font-bold mt-1 text-primary">₹{plan.totalCost}</h2>
          </div>
          <ShoppingBag className="h-10 w-10 text-primary opacity-50" />
        </CardContent>
      </Card>

      <div className="space-y-6">
        {Object.entries(groupedItems).map(([category, items], idx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <h3 className="text-xl font-semibold mb-4 capitalize">{category}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {items.map((item, i) => (
                <Card key={i} className="glass-card hover:bg-card/80 transition-colors">
                  <CardContent className="p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.quantity} {item.unit}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-accent">₹{item.estimatedCost}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
