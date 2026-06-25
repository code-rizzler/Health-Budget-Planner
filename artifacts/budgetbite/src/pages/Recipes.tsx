import { useListRecipes } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Clock, Flame } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";

export function Recipes() {
  const { data: recipes, isLoading } = useListRecipes({
    query: { queryKey: ["recipes"] }
  });
  
  const [filter, setFilter] = useState<string>("All");
  
  const filters = ["All", "Veg", "Non-Veg", "Vegan"];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-64 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  const filteredRecipes = recipes?.filter(r => filter === "All" || r.dietType === filter) || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Recipe Library</h1>
        <p className="text-muted-foreground mt-1">Healthy, budget-friendly meals.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {filters.map(f => (
          <Badge 
            key={f} 
            variant={filter === f ? "default" : "secondary"}
            className="cursor-pointer text-sm py-1 px-4 rounded-full"
            onClick={() => setFilter(f)}
          >
            {f}
          </Badge>
        ))}
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No recipes found matching this filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRecipes.map((recipe, i) => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link href={`/recipes/${recipe.id}`}>
                <Card className="glass-card hover:border-primary/50 transition-all cursor-pointer h-full flex flex-col group overflow-hidden">
                  {recipe.imageUrl ? (
                    <div className="h-48 w-full overflow-hidden">
                      <img 
                        src={recipe.imageUrl} 
                        alt={recipe.name} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  ) : (
                    <div className="h-48 w-full bg-secondary/50 flex items-center justify-center group-hover:bg-secondary transition-colors">
                      <span className="text-muted-foreground">No image</span>
                    </div>
                  )}
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">{recipe.dietType}</Badge>
                    </div>
                    <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
                      {recipe.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4 flex-1">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center"><Clock className="h-4 w-4 mr-1" /> {recipe.cookingTime}m</span>
                      <span className="flex items-center"><Flame className="h-4 w-4 mr-1 text-orange-500" /> {recipe.calories} kcal</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-0 border-t border-border/50 bg-secondary/10 mt-auto px-6 py-3 text-xs text-muted-foreground flex justify-between">
                    <span>P: {recipe.protein}g</span>
                    <span>C: {recipe.carbs}g</span>
                    <span>F: {recipe.fat}g</span>
                  </CardFooter>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
