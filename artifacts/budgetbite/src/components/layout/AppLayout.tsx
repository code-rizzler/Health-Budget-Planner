import { useState } from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, CalendarDays, ShoppingBag, Wallet, BookOpen, BarChart3, Settings, Menu, LogOut, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useClerk } from "@clerk/react";
import { useTheme } from "@/components/theme-provider";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Meal Plan", href: "/meal-plan", icon: CalendarDays },
  { name: "Grocery", href: "/grocery", icon: ShoppingBag },
  { name: "Budget", href: "/budget", icon: Wallet },
  { name: "Recipes", href: "/recipes", icon: BookOpen },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-muted-foreground hover:bg-secondary hover:text-foreground"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      {isDark ? "Light Mode" : "Dark Mode"}
    </button>
  );
}

export function Sidebar() {
  const [location] = useLocation();
  const { signOut } = useClerk();

  const handleSignOut = () => signOut({ redirectUrl: "/" });

  return (
    <div className="hidden lg:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-xl h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-xl leading-none">B</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">BudgetBite</h1>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location === item.href || location.startsWith(`${item.href}/`);
          return (
            <Link key={item.name} href={item.href}>
              <span className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive 
                  ? "bg-primary/10 text-primary font-medium" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}>
                <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border mt-auto space-y-1">
        <ThemeToggle />
        <Link href="/admin">
          <span className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-muted-foreground hover:bg-secondary hover:text-foreground">
            <Settings className="h-5 w-5" />
            Admin
          </span>
        </Link>
        <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

export function MobileNav() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const handleSignOut = () => signOut({ redirectUrl: "/" });

  return (
    <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm leading-none">B</span>
        </div>
        <h1 className="text-lg font-bold tracking-tight text-foreground">BudgetBite</h1>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" onClick={() => setTheme(isDark ? "light" : "dark")}>
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 pt-10 flex flex-col">
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = location === item.href || location.startsWith(`${item.href}/`);
                return (
                  <Link key={item.name} href={item.href} onClick={() => setOpen(false)}>
                    <span className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? "bg-primary/10 text-primary font-medium" 
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}>
                      <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-border mt-auto space-y-1">
              <Link href="/admin" onClick={() => setOpen(false)}>
                <span className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <Settings className="h-5 w-5" />
                  Admin
                </span>
              </Link>
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <MobileNav />
        <main className="flex-1 overflow-x-hidden p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
