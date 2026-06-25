import { useGetBudget, useListExpenses, useAddExpense, useDeleteExpense } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { queryClient } from "@/lib/queryClient";
import { Trash2 } from "lucide-react";

const expenseSchema = z.object({
  amount: z.coerce.number().min(1),
  description: z.string().min(1),
  date: z.string(),
  category: z.string().optional(),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export function Budget() {
  const { toast } = useToast();
  
  const { data: budget, isLoading: budgetLoading } = useGetBudget({
    query: { queryKey: ["budget"] }
  });
  
  const { data: expenses, isLoading: expensesLoading } = useListExpenses({
    query: { queryKey: ["expenses"] }
  });

  const addExpense = useAddExpense();
  const deleteExpense = useDeleteExpense();

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      amount: 0,
      description: "",
      date: new Date().toISOString().split("T")[0],
      category: "Groceries",
    },
  });

  const onSubmit = (data: ExpenseFormValues) => {
    addExpense.mutate({ data }, {
      onSuccess: () => {
        form.reset({ ...form.getValues(), amount: 0, description: "" });
        toast({ title: "Expense Added" });
        queryClient.invalidateQueries({ queryKey: ["budget"] });
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
        queryClient.invalidateQueries({ queryKey: ["dashboardSummary"] });
      }
    });
  };

  const handleDelete = (id: number) => {
    deleteExpense.mutate({ id }, {
      onSuccess: () => {
        toast({ title: "Expense Deleted" });
        queryClient.invalidateQueries({ queryKey: ["budget"] });
        queryClient.invalidateQueries({ queryKey: ["expenses"] });
      }
    });
  };

  if (budgetLoading || expensesLoading) {
    return <div className="p-8 space-y-4"><Skeleton className="h-32" /><Skeleton className="h-64" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Budget Tracker</h1>
        <p className="text-muted-foreground mt-1">Manage your grocery spending.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-end mb-4">
              <div>
                <p className="text-3xl font-bold text-accent">₹{budget?.totalSpent || 0}</p>
                <p className="text-sm text-muted-foreground">spent of ₹{budget?.monthlyBudget || 0}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold">₹{budget?.remaining || 0}</p>
                <p className="text-sm text-muted-foreground">remaining</p>
              </div>
            </div>
            
            <div className="w-full bg-secondary rounded-full h-4 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  (budget?.percentUsed || 0) > 90 ? "bg-destructive" : "bg-accent"
                }`}
                style={{ width: `${Math.min(budget?.percentUsed || 0, 100)}%` }}
              />
            </div>
            <p className="text-xs text-right mt-2 text-muted-foreground">{budget?.percentUsed || 0}% used</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Add Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount (₹)</FormLabel>
                      <FormControl><Input type="number" {...field} /></FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl><Input placeholder="e.g. Milk & Bread" {...field} /></FormControl>
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                            <SelectItem value="Groceries">Groceries</SelectItem>
                            <SelectItem value="Produce">Produce</SelectItem>
                            <SelectItem value="Meat">Meat/Dairy</SelectItem>
                            <SelectItem value="Pantry">Pantry</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl><Input type="date" {...field} /></FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={addExpense.isPending}>
                  {addExpense.isPending ? "Adding..." : "Add Expense"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {(!expenses || expenses.length === 0) ? (
            <p className="text-center text-muted-foreground py-8">No expenses recorded yet.</p>
          ) : (
            <div className="divide-y divide-border">
              {expenses.map((expense, i) => (
                <motion.div 
                  key={expense.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="py-4 flex justify-between items-center group"
                >
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <div className="flex gap-2 text-sm text-muted-foreground">
                      <span>{format(parseISO(expense.date), "MMM d, yyyy")}</span>
                      <span>•</span>
                      <span>{expense.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-lg">₹{expense.amount}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="opacity-0 group-hover:opacity-100 text-destructive"
                      onClick={() => handleDelete(expense.id)}
                      disabled={deleteExpense.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
