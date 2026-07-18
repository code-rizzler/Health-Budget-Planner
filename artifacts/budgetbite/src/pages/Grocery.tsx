import { useGetGroceryPlan, useGenerateGroceryPlan } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { ShoppingBag } from "lucide-react";
import { queryClient } from "@/lib/queryClient";

// Curated Unsplash photo IDs for common Indian grocery items
const GROCERY_PHOTO_IDS: Array<[string, string]> = [
  ["rice",        "1536304993881-ff86d42006d5"],
  ["basmati",     "1536304993881-ff86d42006d5"],
  ["dal",         "1603105037880-880cd4edfb0e"],
  ["lentil",      "1603105037880-880cd4edfb0e"],
  ["moong",       "1603105037880-880cd4edfb0e"],
  ["toor",        "1603105037880-880cd4edfb0e"],
  ["masoor",      "1603105037880-880cd4edfb0e"],
  ["chana",       "1628088035697-d0e7c5dab32b"],
  ["rajma",       "1558818106-7e6b4b0a1c1e"],
  ["kidney",      "1558818106-7e6b4b0a1c1e"],
  ["chickpea",    "1628088035697-d0e7c5dab32b"],
  ["paneer",      "1631452180537-47c4c5f5e6e4"],
  ["cottage",     "1631452180537-47c4c5f5e6e4"],
  ["chicken",     "1604503468506-a8da13d82791"],
  ["mutton",      "1529692236671-f1f6cf9683ba"],
  ["lamb",        "1529692236671-f1f6cf9683ba"],
  ["fish",        "1519708227418-a8effd61523a"],
  ["prawn",       "1565680018434-b513d5e5fd47"],
  ["egg",         "1587486913049-53fc88980cfc"],
  ["milk",        "1550583724-b2692b85b150"],
  ["curd",        "1559181567-c3190b6d9f69"],
  ["yogurt",      "1559181567-c3190b6d9f69"],
  ["ghee",        "1596458695500-1e90d7668f50"],
  ["butter",      "1589985270826-4b7bb135bc9d"],
  ["oil",         "1474979078780-aaadca8dd3f0"],
  ["onion",       "1508747703725-719777637510"],
  ["tomato",      "1471194402529-8555a2604e90"],
  ["potato",      "1518977676601-b53f82aba655"],
  ["aloo",        "1518977676601-b53f82aba655"],
  ["spinach",     "1576045057995-568f77b37a08"],
  ["palak",       "1576045057995-568f77b37a08"],
  ["cauliflower", "1568584393693-b8481c6b65e1"],
  ["gobi",        "1568584393693-b8481c6b65e1"],
  ["pea",         "1612257399117-93a89c2e4e84"],
  ["matar",       "1612257399117-93a89c2e4e84"],
  ["carrot",      "1447175008436-054170537668"],
  ["ginger",      "1509822929464-e4a8f5f12bae"],
  ["garlic",      "1587411684-a1e97ddd6a49"],
  ["capsicum",    "1563565375-f3fdfdbefa83"],
  ["pepper",      "1563565375-f3fdfdbefa83"],
  ["brinjal",     "1473093295043-cae9ef229628"],
  ["baingan",     "1473093295043-cae9ef229628"],
  ["wheat",       "1559181567-c3190b6d9f69"],
  ["atta",        "1574323347407-f5e1ad6962b3"],
  ["flour",       "1574323347407-f5e1ad6962b3"],
  ["bread",       "1509440159596-0249088772ff"],
  ["oat",         "1543610892-0b1f7b7f8fca"],
  ["poha",        "1536304993881-ff86d42006d5"],
  ["semolina",    "1574323347407-f5e1ad6962b3"],
  ["sooji",       "1574323347407-f5e1ad6962b3"],
  ["peanut",      "1567892460931-f5e40c3e2bda"],
  ["nut",         "1567892460931-f5e40c3e2bda"],
  ["almond",      "1567892460931-f5e40c3e2bda"],
  ["apple",       "1568702846914-96b305d2aaeb"],
  ["banana",      "1528825871115-3581a5387919"],
  ["mango",       "1571493516785-87c75f79e0f8"],
  ["lemon",       "1574856326825-2d88e3f67ffa"],
  ["cumin",       "1596040033229-a9821ebd058d"],
  ["jeera",       "1596040033229-a9821ebd058d"],
  ["turmeric",    "1615485925763-86db9d3f2a0a"],
  ["haldi",       "1615485925763-86db9d3f2a0a"],
  ["coriander",   "1596040033229-a9821ebd058d"],
  ["chili",       "1547592180-85f173990554"],
  ["mirchi",      "1547592180-85f173990554"],
  ["salt",        "1558618666-fcd25c85cd64"],
  ["sugar",       "1584483720412-ce931f4aefa8"],
  ["jaggery",     "1584483720412-ce931f4aefa8"],
  ["tea",         "1556679343-c7306c1976bc"],
  ["chai",        "1556679343-c7306c1976bc"],
  ["coffee",      "1495474472287-4d71bcdd2085"],
  ["mustard",     "1596040033229-a9821ebd058d"],
];

const FALLBACK_FOOD_IDS = [
  "1546069901-5b7f7c2fbe9a",
  "1512621776951-a57141f2eefd",
  "1493770348161-369560ae357d",
  "1540189549336-e6e99eb4b951",
];

function groceryImageUrl(name: string, index: number): string {
  const lower = name.toLowerCase();
  const match = GROCERY_PHOTO_IDS.find(([key]) => lower.includes(key));
  const photoId = match
    ? match[1]
    : FALLBACK_FOOD_IDS[index % FALLBACK_FOOD_IDS.length];
  return `https://images.unsplash.com/photo-${photoId}?w=400&h=300&fit=crop&auto=format`;
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
                    src={groceryImageUrl(item.name, i)}
                    alt={item.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    onError={(e) => {
                      const el = e.target as HTMLImageElement;
                      const fallbackId = FALLBACK_FOOD_IDS[(i + 1) % FALLBACK_FOOD_IDS.length];
                      el.src = `https://images.unsplash.com/photo-${fallbackId}?w=400&h=300&fit=crop&auto=format`;
                      el.onerror = null;
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
