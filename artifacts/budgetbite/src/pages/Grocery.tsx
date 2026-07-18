import { useGetGroceryPlan, useGenerateGroceryPlan } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

function groceryImageUrl(name: string): string {
  // Map common Indian grocery items to specific search terms for better results
  const mappings: Record<string, string> = {
    "rice": "basmati rice grains",
    "dal": "lentils dal indian",
    "toor dal": "toor dal lentils",
    "moong dal": "moong dal green lentils",
    "masoor dal": "red lentils masoor",
    "chana": "chickpeas chana",
    "rajma": "kidney beans rajma",
    "paneer": "paneer cottage cheese indian",
    "chicken": "raw chicken pieces",
    "mutton": "mutton lamb meat",
    "fish": "fresh fish market",
    "eggs": "fresh eggs",
    "milk": "milk glass bottle",
    "curd": "yogurt curd bowl",
    "ghee": "ghee clarified butter jar",
    "oil": "cooking oil bottle",
    "onion": "red onions",
    "tomato": "red tomatoes",
    "potato": "potatoes",
    "spinach": "fresh spinach leaves",
    "cauliflower": "cauliflower",
    "peas": "green peas",
    "carrot": "carrots",
    "ginger": "fresh ginger root",
    "garlic": "garlic cloves",
    "wheat flour": "wheat flour atta",
    "bread": "bread loaf",
    "oats": "rolled oats",
    "poha": "poha flattened rice",
    "semolina": "semolina sooji",
    "peanuts": "peanuts groundnuts",
    "nuts": "mixed nuts almonds",
    "apple": "fresh apples",
    "banana": "bananas",
    "cumin": "cumin seeds spice",
    "turmeric": "turmeric powder spice",
    "coriander": "coriander seeds spice",
    "chili": "red chili peppers",
    "salt": "sea salt",
    "sugar": "sugar bowl",
    "tea": "indian tea chai",
    "coffee": "coffee beans",
  };

  const lower = name.toLowerCase();
  let searchTerm = name;
  for (const [key, val] of Object.entries(mappings)) {
    if (lower.includes(key)) {
      searchTerm = val;
      break;
    }
  }

  return `https://source.unsplash.com/featured/400x300/?${encodeURIComponent(searchTerm)},food`;
}

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
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
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

      <div className="space-y-8">
        {Object.entries(groupedItems).map(([category, items], idx) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <h3 className="text-xl font-semibold mb-4 capitalize">{category}</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 + i * 0.04 }}
                  className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-default"
                  style={{ aspectRatio: "4/3" }}
                >
                  {/* Background food image */}
                  <img
                    src={groceryImageUrl(item.name)}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://source.unsplash.com/featured/400x300/?food,grocery,${encodeURIComponent(item.category)}`;
                    }}
                  />

                  {/* Top gradient overlay — item name */}
                  <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/70 to-transparent" />
                  <p className="absolute top-0 inset-x-0 px-3 pt-2.5 text-white font-semibold text-sm leading-tight drop-shadow-md line-clamp-2">
                    {item.name}
                  </p>

                  {/* Bottom gradient overlay — quantity & cost */}
                  <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-black/75 to-transparent" />
                  <div className="absolute bottom-0 inset-x-0 px-3 pb-2.5 flex items-end justify-between">
                    <span className="text-white/85 text-xs">{item.quantity} {item.unit}</span>
                    <span className="text-white font-bold text-sm">₹{item.estimatedCost}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
