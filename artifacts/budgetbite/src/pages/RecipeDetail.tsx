import { useGetRecipe } from "@workspace/api-client-react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Clock, Flame, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export function RecipeDetail() {
  const params = useParams();
  const id = parseInt(params.id || "0");
  
  const { data: recipe, isLoading } = useGetRecipe(id, {
    query: { enabled: !!id, queryKey: ["recipe", id] }
  });

  if (isLoading || !recipe) {
    return <div className="p-8 space-y-8"><Skeleton className="h-10 w-24" /><Skeleton className="h-[40vh] rounded-3xl" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/recipes"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Recipes</Link>
      </Button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="relative h-[30vh] md:h-[40vh] rounded-3xl overflow-hidden mb-8 shadow-xl">
          {recipe.imageUrl ? (
            <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-primary/20 flex items-center justify-center">
              <span className="text-primary text-xl font-medium">{recipe.name}</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-8">
            <div className="text-white">
              <Badge className="mb-3 bg-primary text-primary-foreground border-none hover:bg-primary">{recipe.dietType}</Badge>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{recipe.name}</h1>
              <div className="flex gap-6 text-sm md:text-base font-medium opacity-90">
                <span className="flex items-center"><Clock className="mr-2 h-5 w-5" /> {recipe.cookingTime} mins</span>
                <span className="flex items-center"><Flame className="mr-2 h-5 w-5 text-orange-400" /> {recipe.calories} calories</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-8">
            <div className="glass-card p-6 rounded-2xl">
              <h3 className="font-semibold mb-4 text-lg border-b border-border/50 pb-2">Macros</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Protein</span><span className="font-medium">{recipe.protein}g</span></div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden"><div className="h-full bg-blue-500" style={{width: '40%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Carbs</span><span className="font-medium">{recipe.carbs}g</span></div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden"><div className="h-full bg-yellow-500" style={{width: '50%'}}></div></div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1"><span className="text-muted-foreground">Fat</span><span className="font-medium">{recipe.fat}g</span></div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden"><div className="h-full bg-red-500" style={{width: '20%'}}></div></div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 rounded-2xl">
              <h3 className="font-semibold mb-4 text-lg border-b border-border/50 pb-2">Ingredients</h3>
              <ul className="space-y-3">
                {recipe.ingredients.map((ing, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <ChevronRight className="h-4 w-4 text-primary shrink-0 mr-2 mt-0.5" />
                    <span>{ing}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="glass-card p-8 rounded-2xl h-full">
              <h3 className="font-semibold text-2xl mb-6 border-b border-border/50 pb-4">Instructions</h3>
              <div className="space-y-8">
                {recipe.steps.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                      {i + 1}
                    </div>
                    <p className="text-lg leading-relaxed text-foreground/90 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
