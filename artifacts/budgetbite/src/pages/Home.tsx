import { Link } from "wouter";
import { motion } from "framer-motion";

export function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden flex flex-col items-center justify-center">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/20 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 text-center max-w-3xl px-4"
      >
        <h1 className="text-6xl font-bold tracking-tight mb-6">
          Eat Better. <span className="text-primary">Spend Smarter.</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-10">
          BudgetBite is your personal AI health companion. Plan your meals, track your groceries, and stay within budget without sacrificing nutrition.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/sign-up" className="inline-flex h-12 items-center justify-center rounded-xl bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
            Get Started
          </Link>
          <Link href="/sign-in" className="inline-flex h-12 items-center justify-center rounded-xl border border-input bg-background/50 backdrop-blur px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
