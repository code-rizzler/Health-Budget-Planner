import { useListFoodItems, useCreateFoodItem, useUpdateFoodItem, useDeleteFoodItem } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Trash2, Plus } from "lucide-react";

const foodItemSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1),
  pricePerUnit: z.coerce.number().min(0),
  unit: z.string().min(1),
  calories: z.coerce.number().min(0),
  protein: z.coerce.number().min(0),
  carbs: z.coerce.number().min(0),
  fat: z.coerce.number().min(0),
  dietType: z.string().optional(),
});

type FoodItemForm = z.infer<typeof foodItemSchema>;

export function Admin() {
  const { toast } = useToast();
  const { data: items, isLoading } = useListFoodItems({ query: { queryKey: ["foodItems"] } });
  
  const createItem = useCreateFoodItem();
  const updateItem = useUpdateFoodItem();
  const deleteItem = useDeleteFoodItem();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const form = useForm<FoodItemForm>({
    resolver: zodResolver(foodItemSchema),
    defaultValues: { name: "", category: "Produce", pricePerUnit: 0, unit: "kg", calories: 0, protein: 0, carbs: 0, fat: 0, dietType: "Veg" }
  });

  const openEdit = (item: any) => {
    setEditingId(item.id);
    form.reset(item);
    setOpen(true);
  };

  const openNew = () => {
    setEditingId(null);
    form.reset({ name: "", category: "Produce", pricePerUnit: 0, unit: "kg", calories: 0, protein: 0, carbs: 0, fat: 0, dietType: "Veg" });
    setOpen(true);
  };

  const onSubmit = (data: FoodItemForm) => {
    if (editingId) {
      updateItem.mutate({ id: editingId, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["foodItems"] });
          setOpen(false);
          toast({ title: "Item updated" });
        }
      });
    } else {
      createItem.mutate({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["foodItems"] });
          setOpen(false);
          toast({ title: "Item created" });
        }
      });
    }
  };

  const handleDelete = (id: number) => {
    if(confirm("Delete item?")) {
      deleteItem.mutate({ id }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["foodItems"] });
          toast({ title: "Item deleted" });
        }
      });
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Database</h1>
          <p className="text-muted-foreground mt-1">Manage core food item records.</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNew}><Plus className="mr-2 h-4 w-4" /> Add Food Item</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Item" : "Create Item"}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField control={form.control} name="name" render={({field}) => <FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>} />
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="category" render={({field}) => <FormItem><FormLabel>Category</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>} />
                  <FormField control={form.control} name="dietType" render={({field}) => <FormItem><FormLabel>Diet Type</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>} />
                  <FormField control={form.control} name="pricePerUnit" render={({field}) => <FormItem><FormLabel>Price (₹)</FormLabel><FormControl><Input type="number" {...field}/></FormControl></FormItem>} />
                  <FormField control={form.control} name="unit" render={({field}) => <FormItem><FormLabel>Unit (e.g. kg)</FormLabel><FormControl><Input {...field}/></FormControl></FormItem>} />
                  <FormField control={form.control} name="calories" render={({field}) => <FormItem><FormLabel>Calories</FormLabel><FormControl><Input type="number" {...field}/></FormControl></FormItem>} />
                  <FormField control={form.control} name="protein" render={({field}) => <FormItem><FormLabel>Protein (g)</FormLabel><FormControl><Input type="number" {...field}/></FormControl></FormItem>} />
                  <FormField control={form.control} name="carbs" render={({field}) => <FormItem><FormLabel>Carbs (g)</FormLabel><FormControl><Input type="number" {...field}/></FormControl></FormItem>} />
                  <FormField control={form.control} name="fat" render={({field}) => <FormItem><FormLabel>Fat (g)</FormLabel><FormControl><Input type="number" {...field}/></FormControl></FormItem>} />
                </div>
                <Button type="submit" className="w-full" disabled={createItem.isPending || updateItem.isPending}>Save</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="glass-card">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price/Unit</TableHead>
                <TableHead>Macros (P/C/F)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={5} className="text-center py-8">Loading...</TableCell></TableRow>
              ) : items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name} <span className="text-xs text-muted-foreground block">{item.dietType}</span></TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>₹{item.pricePerUnit} / {item.unit}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{item.protein}g / {item.carbs}g / {item.fat}g</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEdit(item)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
